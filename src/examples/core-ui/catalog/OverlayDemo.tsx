import { useRef, useEffect, useState } from "react";
import { Button, Dialog, Field, Input } from "../../../core/ui";
import Modal from "../../../core/components/general/modal/Modal";
import ConfirmationModal from "../../../core/components/general/modal/ConfirmationModal";
import BottomSheetModal from "../../../core/components/general/modal/BottomSheetModal";
import Drawer from "../../../core/components/general/drawer/Drawer";
import { Example, Message, type DemoProps } from "./shared";

export function OverlayDemo({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [variant, setVariant] = useState<string | null>(null);
  const [nested, setNested] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const title = fa ? "پنجرهٔ نمونه" : "Example window";
  const close = () => setVariant(null);
  const content = (
    <div className="space-y-5">
      <p>
        {fa
          ? "این پنجره از کامپوننت واقعی استفاده می‌کند؛ با Escape یا دکمهٔ بستن آن را ببندید."
          : "This is the real component. Close it with Escape or its close button."}
      </p>
      <Field label={fa ? "عنوان" : "Title"}>
        {(control) => (
          <Input {...control} placeholder={fa ? "متن نمونه" : "Example text"} />
        )}
      </Field>
      <div className="catalog-row justify-end">
        {(id === "dialog" || id === "modal") && (
          <Button onClick={() => setNested(true)}>
            {fa ? "پنجرهٔ تو‌در‌تو" : "Nested window"}
          </Button>
        )}
        <Button tone="neutral" onClick={close}>
          {fa ? "بستن" : "Close"}
        </Button>
      </div>
    </div>
  );
  if (id === "drawer")
    return (
      <>
        <Example
          props={
            'isOpen · onClose · position="left | right" · title · className'
          }
        >
          <div className="catalog-row">
            <Button onClick={() => setVariant("left")}>
              {fa ? "کشوی سمت چپ" : "Left drawer"}
            </Button>
            <Button onClick={() => setVariant("right")}>
              {fa ? "کشوی سمت راست" : "Right drawer"}
            </Button>
          </div>
        </Example>
        <Drawer
          isOpen={variant !== null}
          onClose={close}
          position={variant === "left" ? "left" : "right"}
          title={title}
        >
          {content}
        </Drawer>
        <Dialog
          open={nested}
          onOpenChange={setNested}
          title={fa ? "پنجرهٔ تو‌در‌تو" : "Nested window"}
        >
          <Button onClick={() => setNested(false)}>
            {fa ? "بازگشت" : "Back"}
          </Button>
        </Dialog>
      </>
    );
  if (id === "bottom-sheet")
    return (
      <>
        <Example props="isOpen · onClose · title · className">
          <Button onClick={() => setVariant("sheet")}>
            {fa ? "باز کردن پنجرهٔ پایین صفحه" : "Open bottom sheet"}
          </Button>
        </Example>
        <BottomSheetModal
          isOpen={variant !== null}
          onClose={close}
          title={title}
          className="border-2"
        >
          {content}
        </BottomSheetModal>
        <Dialog
          open={nested}
          onOpenChange={setNested}
          title={fa ? "پنجرهٔ تو‌در‌تو" : "Nested window"}
        >
          <Button onClick={() => setNested(false)}>
            {fa ? "بازگشت" : "Back"}
          </Button>
        </Dialog>
      </>
    );
  if (id === "confirmation")
    return (
      <>
        <Example props="isOpen · onClose · onConfirm · title · message · isDeleting">
          <Button tone="danger" onClick={() => setVariant("confirm")}>
            {fa ? "نمایش تأیید حذف" : "Show delete confirmation"}
          </Button>
        </Example>
        <ConfirmationModal
          isOpen={variant !== null}
          onClose={() => {
            if (!busy) close();
          }}
          onConfirm={() => {
            setBusy(true);
            timer.current = setTimeout(() => {
              setBusy(false);
              close();
              setMessage(fa ? "حذف نمونه انجام شد" : "Sample deleted");
            }, 1000);
          }}
          title={fa ? "تأیید حذف" : "Confirm deletion"}
          message={fa ? "رکورد نمونه حذف شود؟" : "Delete the sample record?"}
          isDeleting={busy}
        />
        <Message>{message}</Message>
      </>
    );
  return (
    <>
      <Example
        props={
          id === "dialog"
            ? "open · onOpenChange · title · description · classNames · mobileBottomSheet"
            : "isOpen · onDismiss · title · mobileBottomSheet · className"
        }
      >
        <div className="catalog-row">
          {["default", "wide", "mobile"].map((value) => (
            <Button key={value} onClick={() => setVariant(value)}>
              {value === "default"
                ? fa
                  ? "پنجرهٔ معمولی"
                  : "Standard dialog"
                : value === "wide"
                  ? fa
                    ? "پنجرهٔ عریض"
                    : "Wide dialog"
                  : fa
                    ? "حالت موبایل"
                    : "Mobile sheet"}
            </Button>
          ))}
        </div>
      </Example>
      {id === "dialog" ? (
        <Dialog
          open={variant !== null}
          onOpenChange={(open) => {
            if (!open) close();
          }}
          title={title}
          description={
            fa
              ? "تم، جهت و زبان از scope فعلی دریافت می‌شوند."
              : "Theme, direction and language follow the current scope."
          }
          mobileBottomSheet={variant === "mobile"}
          className={variant === "wide" ? "max-w-3xl" : undefined}
          classNames={{ description: "mb-4", header: "border-b pb-3" }}
        >
          {content}
          <Dialog
            open={nested}
            onOpenChange={setNested}
            title={fa ? "پنجرهٔ تو‌در‌تو" : "Nested window"}
          >
            <Button onClick={() => setNested(false)}>
              {fa ? "بازگشت" : "Back"}
            </Button>
          </Dialog>
        </Dialog>
      ) : (
        <Modal
          isOpen={variant !== null}
          onDismiss={close}
          title={title}
          mobileBottomSheet={variant === "mobile"}
          className={variant === "wide" ? "max-w-3xl" : undefined}
        >
          {content}
          <Modal
            isOpen={nested}
            onDismiss={() => setNested(false)}
            title={fa ? "پنجرهٔ تو‌در‌تو" : "Nested window"}
          >
            <Button onClick={() => setNested(false)}>
              {fa ? "بازگشت" : "Back"}
            </Button>
          </Modal>
        </Modal>
      )}
    </>
  );
}
