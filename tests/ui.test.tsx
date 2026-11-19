import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { z } from "zod/v3";
import {
  Button,
  ButtonBase,
  CoreUIProvider,
  Dialog,
  DialogBase,
  Field,
  FieldBase,
  Input,
  InputBase,
  Table,
  TableBase,
  Skeleton,
  ThemeScope,
} from "../src/core/ui";
import { CoreProvider } from "../src/core/entity/CoreProvider";
import LegacyButton from "../src/core/components/general/button/Button";
import Modal from "../src/core/components/general/modal/Modal";
import FormInput from "../src/core/components/form/FormInput";
import { FormWrapper } from "../src/core/components/form/FormWrapper";
import DataTable from "../src/core/components/Table/DataTable";
import Accordion from "../src/core/components/general/Accordion";
import { Checkbox } from "../src/core/components/form/Checkbox";
import { FormSelect } from "../src/core/components/form/FormSelect";

describe("core UI contracts", () => {
  it("renders accessible-by-default skeleton decoration and forwards its sizing, state and ref", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Skeleton
        ref={ref}
        shape="circle"
        animate={false}
        width={64}
        height={64}
        className="custom-skeleton"
      />,
    );
    expect(ref.current).toBe(container.firstChild);
    expect(ref.current).toHaveAttribute("aria-hidden", "true");
    expect(ref.current).toHaveAttribute("data-shape", "circle");
    expect(ref.current).not.toHaveAttribute("data-animate");
    expect(ref.current).toHaveStyle({ width: "64px", height: "64px" });
    expect(ref.current).toHaveClass("custom-skeleton");
  });
  it("keeps accordion content out of focus order while closed and does not submit its enclosing form", async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Accordion title="Expand">
          <button type="button">Inside</button>
        </Accordion>
      </form>,
    );
    const trigger = screen.getByRole("button", { name: "Expand" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("button", { name: "Inside" }),
    ).not.toBeInTheDocument();
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Inside" })).toBeVisible();
    expect(submit).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("keeps checkbox and select labels distinct when form field names repeat", () => {
    render(
      <>
        {[1, 2].map((key) => (
          <FormWrapper
            key={key}
            defaultValues={{ choice: 0, enabled: true }}
            onSubmit={() => {}}
          >
            <Checkbox name="enabled" label="Enabled" />
            <FormSelect
              name="choice"
              label="Choice"
              options={[{ value: 0, label: "Zero" }]}
            />
          </FormWrapper>
        ))}
      </>,
    );
    const checks = screen.getAllByLabelText("Enabled");
    const selects = screen.getAllByLabelText("Choice");
    expect(checks[0].id).not.toBe(checks[1].id);
    expect(selects[0].id).not.toBe(selects[1].id);
    expect(checks[0]).toBeChecked();
    expect(selects[0]).toHaveValue("0");
  });
  it("forwards native button props, ref and the actual click event without submitting by default", async () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    const submit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button
          ref={ref}
          onClick={click}
          aria-label="Native action"
          data-trace="save"
          style={{ margin: 7 }}
        >
          Save
        </Button>
      </form>,
    );
    const button = screen.getByRole("button", { name: "Native action" });
    await userEvent.click(button);
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("data-trace", "save");
    expect(button).toHaveStyle({ margin: "7px" });
    expect(click.mock.calls[0][0].nativeEvent).toBeInstanceOf(MouseEvent);
    expect(submit).not.toHaveBeenCalled();
  });

  it("resolves project, page and instance defaults and classes in each slot", () => {
    render(
      <CoreUIProvider
        value={{
          components: {
            Button: {
              defaultProps: {
                size: "lg",
                appearance: "outline",
                disabled: true,
              },
              className: "p-8 rounded-none",
              classNames: { icon: "size-6 text-red-600", label: "font-medium" },
            },
          },
        }}
      >
        <CoreUIProvider
          value={{
            components: {
              Button: {
                defaultProps: { size: "sm", appearance: undefined },
                classNames: { root: "p-4", icon: "size-5" },
              },
            },
          }}
        >
          <Button
            disabled={false}
            appearance={undefined}
            classNames={{ root: "p-2", icon: "size-4", label: "font-bold" }}
            className="rounded-full"
            startIcon={<svg />}
          >
            Merged
          </Button>
        </CoreUIProvider>
      </CoreUIProvider>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button).toHaveAttribute("data-appearance", "outline");
    expect(button).toHaveClass("p-2", "rounded-full");
    expect(button).not.toHaveClass("p-8", "p-4", "rounded-none");
    expect(button.querySelector('[data-slot="icon"]')).toHaveClass(
      "size-4",
      "text-red-600",
    );
    expect(button.querySelector('[data-slot="icon"]')).not.toHaveClass(
      "size-5",
      "size-6",
    );
    expect(button.querySelector('[data-slot="label"]')).toHaveClass(
      "font-bold",
    );
  });

  it("lets a page override a project root class through either root API", () => {
    render(
      <CoreUIProvider value={{ components: { Button: { className: "p-8" } } }}>
        <CoreUIProvider
          value={{ components: { Button: { classNames: { root: "p-4" } } } }}
        >
          <Button>Page</Button>
          <Button classNames={{ root: "p-2" }}>Instance</Button>
        </CoreUIProvider>
      </CoreUIProvider>,
    );
    expect(screen.getByText("Page").closest("button")).toHaveClass("p-4");
    expect(screen.getByText("Page").closest("button")).not.toHaveClass("p-8");
    expect(screen.getByText("Instance").closest("button")).toHaveClass("p-2");
  });

  it("passes resolved props and refs to typed replacements through legacy controls", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <CoreUIProvider
        value={{
          components: { Button: { defaultProps: { size: "sm" } } },
          registry: {
            Button: (props) => (
              <ButtonBase {...props} data-replacement="button" />
            ),
            Input: (props) => <InputBase {...props} data-replacement="input" />,
            Field: (props) => <FieldBase {...props} data-replacement="field" />,
            Dialog: (props) => (
              <DialogBase {...props} data-replacement="dialog" />
            ),
            Table: (props) => <TableBase {...props} data-replacement="table" />,
          },
        }}
      >
        <LegacyButton ref={ref}>Legacy</LegacyButton>
        <FormInput standalone name="title" label="Replaced title" />
        <Modal isOpen onDismiss={() => {}} title="Replaced modal">
          <span>Body</span>
        </Modal>
        <DataTable<{ id: number }>
          data={[]}
          header={<th>Name</th>}
          renderRow={() => null}
          page={0}
          pageSize={10}
          totalPages={0}
          totalItems={0}
          sortValue=""
          sortOptions={[]}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          onSortChange={() => {}}
          dataIdKey="id"
        />
      </CoreUIProvider>,
    );
    expect(ref.current).toHaveAttribute("data-replacement", "button");
    expect(ref.current).toHaveAttribute("data-size", "sm");
    expect(screen.getByLabelText("Replaced title")).toHaveAttribute(
      "data-replacement",
      "input",
    );
    expect(
      screen
        .getByLabelText("Replaced title")
        .closest('[data-core-component="Field"]'),
    ).toHaveAttribute("data-replacement", "field");
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "data-replacement",
      "dialog",
    );
    // The dialog intentionally hides background semantics while open.
    expect(document.querySelector("table")).toHaveAttribute(
      "data-replacement",
      "table",
    );
  });

  it("preserves legacy permission, variant, zero badge and loading behavior", () => {
    render(
      <CoreProvider value={{ can: (permission) => permission !== "denied" }}>
        <LegacyButton permission="denied">Hidden</LegacyButton>
        <LegacyButton variant="danger" badgeCount={0}>
          Delete
        </LegacyButton>
        <LegacyButton loading>Save</LegacyButton>
      </CoreProvider>,
    );
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
    expect(screen.getByText("Delete").closest("button")).toHaveAttribute(
      "data-tone",
      "danger",
    );
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "در حال پردازش..." }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "در حال پردازش..." }),
    ).toHaveAttribute("aria-busy", "true");
  });

  it("associates unique labels, descriptions and errors and preserves native input size and ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <Field label="Title" description="Public name" error="Required">
          {(control) => <Input {...control} ref={ref} size={30} />}
        </Field>
        <Field label="Title" controlId="explicit-title">
          {(control) => <Input {...control} />}
        </Field>
      </>,
    );
    const inputs = screen.getAllByLabelText("Title");
    expect(inputs[0].id).not.toBe(inputs[1].id);
    expect(inputs[1].id).toBe("explicit-title");
    expect(ref.current).toBe(inputs[0]);
    expect(inputs[0]).toHaveAttribute("size", "30");
    expect(inputs[0]).toHaveAttribute("aria-invalid", "true");
    expect(inputs[0]).toHaveAccessibleDescription("Public name Required");
  });

  it("focuses an invalid RHF input and keeps wrapper and control classes separate", async () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <FormWrapper
        schema={z.object({ title: z.string().min(1, "Required") })}
        defaultValues={{ title: "" }}
        onSubmit={() => {}}
      >
        <FormInput
          name="title"
          label="Title"
          ref={ref}
          className="max-w-sm"
          classNames={{ input: "border-0" }}
        />
        <Button type="submit">Submit</Button>
      </FormWrapper>,
    );
    await userEvent.click(screen.getByText("Submit"));
    expect(await screen.findByRole("alert")).toHaveTextContent("Required");
    const input = screen.getByLabelText("Title");
    await waitFor(() => expect(input).toHaveFocus());
    expect(ref.current).toBe(input);
    expect(input).toHaveClass("border-0");
    expect(input).not.toHaveClass("max-w-sm");
    expect(input.closest('[data-core-component="Field"]')).toHaveClass(
      "max-w-sm",
    );
  });

  it("keeps duplicate form names unique and forwards multiline blur and focus to RHF", async () => {
    const blur = vi.fn();
    const schema = z.object({ notes: z.string().min(1, "Notes required") });
    render(
      <>
        <FormWrapper
          schema={schema}
          defaultValues={{ notes: "" }}
          onSubmit={() => {}}
        >
          <FormInput multiline name="notes" label="Notes" onBlur={blur} />
          <Button type="submit">Submit</Button>
        </FormWrapper>
        <FormInput standalone name="notes" label="Notes" />
      </>,
    );
    const fields = screen.getAllByLabelText("Notes");
    expect(fields[0].id).not.toBe(fields[1].id);
    await userEvent.click(fields[0]);
    await userEvent.tab();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Notes required",
    );
    expect(blur).toHaveBeenCalledOnce();
    expect(blur.mock.calls[0][0].target).toBe(fields[0]);
    await userEvent.click(screen.getByText("Submit"));
    await waitFor(() => expect(fields[0]).toHaveFocus());
  });

  it("scopes portal DOM, direction and language without changing document or nested runtime settings", async () => {
    const initialDirection = document.documentElement.dir;
    function Example({
      direction,
      locale,
    }: {
      direction: "rtl" | "ltr";
      locale: string;
    }) {
      const [open, setOpen] = useState(false);
      return (
        <CoreProvider value={{ locale, direction }}>
          <ThemeScope
            tokens={{ "--core-action-bg": "#0f766e" }}
            data-testid="brand"
          >
            <CoreProvider value={{ lookups: {} }}>
              <Button onClick={() => setOpen(true)}>Open</Button>
              <Dialog
                open={open}
                onOpenChange={setOpen}
                title="Scoped dialog"
                description="Details"
                closeLabel="Close"
              >
                <Input aria-label="Inside" />
              </Dialog>
            </CoreProvider>
          </ThemeScope>
        </CoreProvider>
      );
    }
    const { rerender } = render(<Example direction="ltr" locale="en-US" />);
    await userEvent.click(screen.getByText("Open"));
    const dialog = screen.getByRole("dialog");
    expect(screen.getByTestId("brand")).toContainElement(dialog);
    expect(dialog.closest("[data-core-portal]")).not.toBeNull();
    expect(dialog).toHaveAttribute("dir", "ltr");
    expect(dialog).toHaveAttribute("lang", "en-US");
    expect(dialog).toHaveAccessibleDescription("Details");
    expect(document.documentElement.dir).toBe(initialDirection);
    rerender(<Example direction="rtl" locale="ar-EG" />);
    expect(dialog).toHaveAttribute("dir", "rtl");
    expect(dialog).toHaveAttribute("lang", "ar-EG");
    expect(document.documentElement.dir).toBe(initialDirection);
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Open" })).toHaveFocus(),
    );
  });

  it("renders table empty semantics, slots, native attributes and ref", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table
        ref={ref}
        aria-label="Records"
        empty
        columnCount={3}
        caption="Record list"
        emptyContent="No records"
        header={<th scope="col">Name</th>}
        classNames={{ viewport: "max-w-sm", empty: "italic" }}
      />,
    );
    expect(ref.current).toBe(screen.getByRole("table"));
    expect(screen.getByRole("table")).toHaveAccessibleName("Records");
    expect(screen.getByText("No records")).toHaveAttribute("colspan", "3");
    expect(screen.getByText("No records")).toHaveClass("italic");
    expect(ref.current?.parentElement).toHaveClass("max-w-sm");
  });
});
