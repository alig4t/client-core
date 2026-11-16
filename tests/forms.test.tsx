import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormContext } from "react-hook-form";
import { z } from "zod/v3";
import { FormWrapper } from "../src/core/components/form/FormWrapper";
import FormInput from "../src/core/components/form/FormInput";
import { FormSelect } from "../src/core/components/form/FormSelect";
import { Checkbox } from "../src/core/components/form/Checkbox";
import { FormAutoComplete } from "../src/core/components/form/FormAutoComplete";
import Modal from "../src/core/components/general/modal/Modal";
import { ApiError } from "../src/core/service/contracts";
import { DateObject } from "react-multi-date-picker";
import {
  serializePickedDate,
  datePickerValue,
} from "../src/core/components/form/DateInput";
function SubmitState() {
  const { formState } = useFormContext();
  return <span>{formState.isSubmitting ? "submitting" : "idle"}</span>;
}
describe("form lifecycle and controls", () => {
  it("retains numeric option zero and false checkbox values", async () => {
    const user = userEvent.setup(),
      submit = vi.fn();
    render(
      <FormWrapper
        onSubmit={submit}
        defaultValues={{ choice: 1, enabled: true }}
      >
        <FormSelect
          name="choice"
          label="Choice"
          options={[
            { value: 0, label: "Zero" },
            { value: 1, label: "One" },
          ]}
        />
        <Checkbox name="enabled" label="Enabled" />
        <button type="submit">Save</button>
      </FormWrapper>,
    );
    await user.selectOptions(screen.getByLabelText("Choice"), "0");
    await user.click(screen.getByLabelText("Enabled"));
    await user.click(screen.getByText("Save"));
    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({ choice: 0, enabled: false }),
    );
  });
  it("awaits submit and displays server field errors", async () => {
    let fail: (error: unknown) => void = () => {};
    const promise = new Promise<void>((_, reject) => {
      fail = reject;
    });
    const user = userEvent.setup();
    render(
      <FormWrapper
        schema={z.object({ title: z.string() })}
        defaultValues={{ title: "hello" }}
        onSubmit={() => promise}
      >
        <FormInput name="title" label="Title" />
        <SubmitState />
        <button type="submit">Save</button>
      </FormWrapper>,
    );
    await user.click(screen.getByText("Save"));
    expect(await screen.findByText("submitting")).toBeInTheDocument();
    fail(new ApiError("Invalid", 422, { title: "Duplicate title" }));
    expect(await screen.findByText("Duplicate title")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
  });
  it("resets values when the record key changes", async () => {
    const renderForm = (key: string, title: string) => (
      <FormWrapper
        recordKey={key}
        defaultValues={{ title }}
        onSubmit={() => {}}
      >
        <FormInput name="title" label="Title" />
      </FormWrapper>
    );
    const { rerender } = render(renderForm("a", "first"));
    expect(screen.getByLabelText("Title")).toHaveValue("first");
    rerender(renderForm("b", "second"));
    await waitFor(() =>
      expect(screen.getByLabelText("Title")).toHaveValue("second"),
    );
  });
  it("supports decimal text and long values without truncation", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FormInput standalone name="decimal" label="Decimal" type="double" />
        <FormInput standalone name="long" label="Long" type="long" />
      </>,
    );
    await user.type(screen.getByLabelText("Decimal"), "123.456");
    await user.type(screen.getByLabelText("Long"), "9007199254740993");
    expect(screen.getByLabelText("Decimal")).toHaveValue("123.456");
    expect(screen.getByLabelText("Long")).toHaveValue("9007199254740993");
  });
  it("ignores stale autocomplete requests and preserves multiple selections", async () => {
    const pending: {
      resolve: (value: {
        data: { id: number; name: string }[];
        meta: { totalPages: number };
      }) => void;
    }[] = [];
    const service = {
      getAll: vi.fn(
        () =>
          new Promise<{
            data: { id: number; name: string }[];
            meta: { totalPages: number };
          }>((resolve) => pending.push({ resolve })),
      ),
    };
    const user = userEvent.setup();
    render(
      <FormWrapper defaultValues={{ tags: [] }} onSubmit={() => {}}>
        <FormAutoComplete
          name="tags"
          label="Tags"
          service={service}
          valueKey="id"
          labelKey="name"
          multi
          debounceTime={1}
        />
      </FormWrapper>,
    );
    await user.click(screen.getByRole("combobox"));
    await waitFor(() => expect(pending.length).toBe(1));
    await user.type(screen.getByLabelText("جستجو Tags"), "new");
    await waitFor(() => expect(pending.length).toBeGreaterThan(1));
    pending[pending.length - 1].resolve({
      data: [{ id: 2, name: "New" }],
      meta: { totalPages: 1 },
    });
    await user.click(await screen.findByText("New"));
    pending[0].resolve({
      data: [{ id: 1, name: "Stale" }],
      meta: { totalPages: 1 },
    });
    await waitFor(() =>
      expect(screen.queryByText("Stale")).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("New");
  });
  it("traps modal focus, closes with Escape and restores focus", async () => {
    const close = vi.fn(),
      user = userEvent.setup();
    const { rerender } = render(
      <>
        <button>Open</button>
        <Modal isOpen={false} onDismiss={close} title="Dialog">
          <button>Action</button>
        </Modal>
      </>,
    );
    screen.getByText("Open").focus();
    rerender(
      <>
        <button>Open</button>
        <Modal isOpen onDismiss={close} title="Dialog">
          <button>Action</button>
        </Modal>
      </>,
    );
    expect(screen.getByLabelText("بستن مودال")).toHaveFocus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(screen.getByText("Action")).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(close).toHaveBeenCalled();
    rerender(
      <>
        <button>Open</button>
        <Modal isOpen={false} onDismiss={close} title="Dialog">
          <button>Action</button>
        </Modal>
      </>,
    );
    expect(screen.getByText("Open")).toHaveFocus();
  });
  it("round-trips date-only and local datetime without timezone conversion", () => {
    const date = new DateObject({ date: "2026-03-21", format: "YYYY-MM-DD" });
    expect(serializePickedDate(date, "date")).toBe("2026-03-21");
    expect(
      serializePickedDate(datePickerValue("2026-03-21", "date"), "date"),
    ).toBe("2026-03-21");
    expect(
      serializePickedDate(
        datePickerValue("2026-03-21T14:30:00", "datetime"),
        "datetime",
      ),
    ).toBe("2026-03-21T14:30:00");
  });
});
