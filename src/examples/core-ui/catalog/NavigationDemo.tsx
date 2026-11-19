import { useState } from "react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { Check, Eye, Pencil, User } from "lucide-react";
import { Button } from "../../../core/ui";
import Accordion from "../../../core/components/general/Accordion";
import Dropdown from "../../../core/components/general/DropDown";
import Breadcrumb from "../../../core/components/general/BreadCrumb";
import Stepper from "../../../core/components/general/stepper/Stepper";
import CompactStepper from "../../../core/components/general/stepper/CompactStepper";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../core/components/ui/tooltip";
import TableLink from "../../../core/components/general/link/TableLink";
import LinkView from "../../../core/components/general/link/LinkView";
import NavLink from "../../../core/components/general/link/NavLink";
import { Example, Message, type DemoProps } from "./shared";

function CurrentRoute() {
  return <Message>{useLocation().pathname}</Message>;
}
function LinkExamples({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [clicked, setClicked] = useState(false);
  return (
    <MemoryRouter>
      <Example
        props={
          id === "link-view"
            ? "viewName · id · label · disabled · className"
            : id === "nav-link"
              ? 'variant="display | edit | accept | delete" · permission · viewName · idParam · tooltipSide'
              : "to | onClick · tooltipText · tooltipSide · permission · className"
        }
      >
        <div className="catalog-row">
          {id === "link-view" ? (
            <>
              <LinkView
                viewName="catalog.detail"
                id={1}
                label={fa ? "مشاهدهٔ رکورد" : "View record"}
              />
              <LinkView
                viewName="catalog.detail"
                id={2}
                label={fa ? "لینک غیرفعال" : "Disabled link"}
                disabled
              />
            </>
          ) : id === "nav-link" ? (
            <>
              {(["display", "edit", "accept", "delete"] as const).map(
                (variant) => (
                  <NavLink
                    key={variant}
                    variant={variant}
                    permission="catalog.allowed"
                    viewName="catalog.detail"
                    idParam={1}
                    label={variant}
                    tooltipSide="top"
                  />
                ),
              )}
              <NavLink
                variant="display"
                permission="catalog.denied"
                viewName="catalog.detail"
                idParam={1}
                label="denied"
              />
            </>
          ) : (
            <>
              <TableLink to="/catalog/1" tooltipText={fa ? "مشاهده" : "View"}>
                <Eye size={20} />
              </TableLink>
              <TableLink
                onClick={() => setClicked(true)}
                tooltipText={fa ? "ویرایش با callback" : "Edit with callback"}
                tooltipSide="top"
              >
                <Pencil size={20} />
              </TableLink>
            </>
          )}
        </div>
      </Example>
      <CurrentRoute />
      {clicked && (
        <Message>{fa ? "callback اجرا شد" : "Callback fired"}</Message>
      )}
    </MemoryRouter>
  );
}

export function NavigationDemo(props: DemoProps) {
  const { id, language, direction } = props;
  const fa = language === "fa";
  const [current, setCurrent] = useState(1);
  const [message, setMessage] = useState("");
  const steps = [
    {
      id: 1,
      label: fa ? "اطلاعات" : "Details",
      description: fa ? "اطلاعات اولیه" : "Basic details",
      icon: User,
    },
    {
      id: 2,
      label: fa ? "بررسی" : "Review",
      description: fa ? "بررسی ورودی‌ها" : "Review inputs",
      icon: Eye,
    },
    {
      id: 3,
      label: fa ? "تأیید" : "Confirm",
      description: fa ? "ثبت نهایی" : "Final confirmation",
      icon: Check,
    },
  ];
  if (["link-view", "nav-link", "table-link"].includes(id))
    return <LinkExamples {...props} />;
  if (id === "accordion")
    return (
      <>
        <Example props="startOpen=false">
          <Accordion
            title={
              fa
                ? "آکاردئون بسته؛ برای باز کردن کلیک کنید"
                : "Closed accordion; click to expand"
            }
          >
            <p>
              {fa
                ? "این محتوای واقعی آکاردئون است."
                : "This is the accordion content."}
            </p>
            <Button
              onClick={() =>
                setMessage(fa ? "دکمهٔ داخل آکاردئون" : "Accordion action")
              }
            >
              {fa ? "یک اقدام" : "An action"}
            </Button>
          </Accordion>
        </Example>
        <Example props="startOpen=true · title=ReactNode">
          <Accordion
            startOpen
            title={
              <span className="inline-flex items-center gap-2">
                <Check size={18} />
                {fa
                  ? "آکاردئون باز با عنوان ترکیبی"
                  : "Open accordion with a composed title"}
              </span>
            }
          >
            <p>
              {fa
                ? "محتوا از ابتدا قابل مشاهده است."
                : "Content is initially visible."}
            </p>
          </Accordion>
        </Example>
        <Message>{message}</Message>
      </>
    );
  if (id === "dropdown")
    return (
      <>
        <Example
          props={`align="start | end" · dir="${direction}" · trigger · className`}
        >
          <div className="catalog-row">
            {(["start", "end"] as const).map((align) => (
              <Dropdown
                key={align}
                dir={direction}
                align={align}
                trigger={
                  <Button>
                    {fa ? "باز کردن منو" : "Open menu"} ({align})
                  </Button>
                }
                className="max-w-full"
              >
                <div className="p-3 space-y-2">
                  <p>{fa ? "محتوای منوی نمونه" : "Sample menu content"}</p>
                  <Button onClick={() => setMessage(align)}>
                    {fa ? "انتخاب گزینه" : "Choose option"}
                  </Button>
                </div>
              </Dropdown>
            ))}
          </div>
        </Example>
        <Message>{message}</Message>
      </>
    );
  if (id === "breadcrumb")
    return (
      <MemoryRouter>
        <Example props="items=[{ label, href }] · className">
          <Breadcrumb
            items={[
              { label: fa ? "خانه" : "Home", href: "/" },
              { label: fa ? "مدیریت" : "Management", href: "/management" },
              { label: fa ? "صفحهٔ فعلی" : "Current page" },
            ]}
          />
        </Example>
        <Example props="items=[single item]">
          <Breadcrumb
            items={[{ label: fa ? "داشبورد" : "Dashboard" }]}
            className="shadow-none"
          />
        </Example>
        <CurrentRoute />
      </MemoryRouter>
    );
  if (id === "tooltip")
    return (
      <Example
        props={
          'side="top | right | bottom | left" · sideOffset=8 · delayDuration=150 · asChild'
        }
      >
        <div className="catalog-row py-8">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side} delayDuration={150}>
              <TooltipTrigger asChild>
                <Button tone="neutral">{side}</Button>
              </TooltipTrigger>
              <TooltipContent side={side} sideOffset={8}>
                {fa ? "متن راهنمای نمونه" : "Sample tooltip"}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </Example>
    );
  return (
    <>
      <div className="catalog-row">
        <Button onClick={() => setCurrent((value) => Math.max(0, value - 1))}>
          {fa ? "مرحلهٔ قبل" : "Previous step"}
        </Button>
        <Button onClick={() => setCurrent((value) => Math.min(2, value + 1))}>
          {fa ? "مرحلهٔ بعد" : "Next step"}
        </Button>
        <Message>{current + 1}</Message>
      </div>
      {id === "compact-stepper" ? (
        <Example props="steps · currentStep · className">
          <CompactStepper steps={steps} currentStep={current} />
        </Example>
      ) : (
        <>
          <Example
            props={
              'orientation="horizontal" · currentStep · steps(icon, description) · onStepClick'
            }
          >
            <Stepper
              steps={steps}
              currentStep={current}
              onStepClick={setCurrent}
            />
          </Example>
          <Example
            props={'orientation="vertical" · allowClickOnCompleted=false'}
          >
            <Stepper
              steps={steps}
              currentStep={current}
              orientation="vertical"
              allowClickOnCompleted={false}
            />
          </Example>
          <Example props="steps without icons/descriptions · currentStep=0">
            <Stepper
              steps={steps.map(({ id, label }) => ({ id, label }))}
              currentStep={0}
            />
          </Example>
        </>
      )}
    </>
  );
}
