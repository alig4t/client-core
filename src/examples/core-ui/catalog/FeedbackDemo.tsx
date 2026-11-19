import { useEffect, useRef, useState } from "react";
import { Button, Skeleton } from "../../../core/ui";
import Spinner from "../../../core/components/general/loading/Spinner";
import LoadingSpinner from "../../../core/components/general/loading/LoadingSpinner";
import LocalLoadingOverlay from "../../../core/components/layout/LocalLoadingOverlay";
import LoadingOverlay from "../../../core/components/general/loading/LoadingOverlay";
import GlobalLoaderProvider from "../../../core/components/layout/GlobalLoaderProvider";
import TablePlaceholder from "../../../core/components/general/placeHolder/TablePlaceholder";
import CreatePagePlaceholder from "../../../core/components/general/placeHolder/CreatePagePlaceholder";
import ViewPagePlaceholder from "../../../core/components/general/placeHolder/ViewPagePlaceholder";
import ErrorMessage from "../../../core/components/general/ErrorMessage";
import TableErrorState from "../../../core/components/general/TableErrorState";
import { ErrorBoundary } from "../../../core/entity/ErrorBoundary";
import {
  LoadingProvider,
  useLoading,
} from "../../../core/stores/LoadingContext";
import { loadingStore } from "../../../core/stores/loadingStore";
import { Example, Message, PreviewFrame, type DemoProps } from "./shared";

function ContextLoader({ language }: Pick<DemoProps, "language">) {
  const { openWaitDialog, closeWaitDialog } = useLoading();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeRef = useRef(closeWaitDialog);
  closeRef.current = closeWaitDialog;
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      closeRef.current();
    },
    [],
  );
  return (
    <>
      <Button
        onClick={() => {
          openWaitDialog(
            language === "fa"
              ? "بارگذاری نمونه؛ دو ثانیه"
              : "Demo loading for two seconds",
          );
          timer.current = setTimeout(closeWaitDialog, 2000);
        }}
      >
        {language === "fa"
          ? "نمایش بارگذاری تمام‌صفحه"
          : "Show full-screen loading"}
      </Button>
      <LoadingOverlay />
    </>
  );
}
function StoreLoader({ language }: Pick<DemoProps, "language">) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const active = useRef(false);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (active.current) loadingStore.hide();
    },
    [],
  );
  return (
    <>
      <Button
        onClick={() => {
          if (active.current) return;
          active.current = true;
          loadingStore.show();
          timer.current = setTimeout(() => {
            active.current = false;
            loadingStore.hide();
          }, 2000);
        }}
      >
        {language === "fa"
          ? "فعال‌کردن loader سراسری"
          : "Activate global loader"}
      </Button>
      <GlobalLoaderProvider />
    </>
  );
}
function ErrorExample({ language }: Pick<DemoProps, "language">) {
  const [fail, setFail] = useState(false);
  function Content() {
    if (fail) throw new Error("Catalog error boundary demo");
    return (
      <p>
        {language === "fa"
          ? "این محتوا سالم نمایش داده می‌شود."
          : "This content renders successfully."}
      </p>
    );
  }
  return (
    <>
      <div className="catalog-row">
        <Button onClick={() => setFail(true)}>
          {language === "fa" ? "ایجاد خطای نمایشی" : "Trigger render error"}
        </Button>
        <Button tone="neutral" onClick={() => setFail(false)}>
          {language === "fa" ? "رفع خطا" : "Clear error"}
        </Button>
      </div>
      <ErrorBoundary key={String(fail)}>
        <Content />
      </ErrorBoundary>
    </>
  );
}
export function FeedbackDemo({ id, language }: DemoProps) {
  const fa = language === "fa";
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  if (id === "skeleton")
    return (
      <>
        <Example props={'shape="text | rect | circle" · width · height'}>
          <div className="catalog-grid">
            <div className="space-y-3">
              <Skeleton width="85%" />
              <Skeleton width="65%" />
              <Skeleton width="45%" />
            </div>
            <Skeleton shape="rect" height={96} />
            <Skeleton shape="circle" width={72} height={72} />
          </div>
        </Example>
        <Example props="animate=false · className · style · classNames.root">
          <div className="catalog-grid">
            <Skeleton animate={false} height={40} />
            <Skeleton
              shape="rect"
              className="rounded-2xl"
              style={{ background: "var(--core-action-bg)" }}
            />
          </div>
        </Example>
        <Example props="composed card">
          <div className="flex gap-4">
            <Skeleton shape="circle" />
            <div className="flex-1 space-y-3">
              <Skeleton width="60%" />
              <Skeleton />
              <Skeleton width="80%" />
            </div>
          </div>
        </Example>
      </>
    );
  if (id === "spinner")
    return (
      <Example props="size=20 | 36 | 56 · className">
        <div className="catalog-row">
          <Spinner size={20} />
          <Spinner size={36} className="text-emerald-600" />
          <Spinner size={56} />
        </div>
      </Example>
    );
  if (id === "loading-spinner")
    return (
      <Example props="message">
        <LoadingSpinner
          message={
            fa ? "در حال دریافت اطلاعات نمونه…" : "Loading sample records…"
          }
        />
      </Example>
    );
  if (id === "local-loading")
    return (
      <>
        <Example props="isLoading=true · message · fullScreen=false">
          <div className="relative h-44 border rounded-lg">
            <LocalLoadingOverlay
              isLoading
              message={
                fa ? "بارگذاری داخل همین ظرف" : "Loading within this container"
              }
            />
          </div>
        </Example>
        <Example props="isLoading=false">
          <div className="relative h-20 border rounded-lg p-4">
            <p>{fa ? "محتوای قابل تعامل" : "Interactive content"}</p>
            <LocalLoadingOverlay isLoading={false} />
          </div>
        </Example>
        <Example props="fullScreen=true (2 seconds)">
          <Button
            onClick={() => {
              setLoading(true);
              timer.current = setTimeout(() => setLoading(false), 2000);
            }}
          >
            {fa ? "نمایش حالت تمام‌صفحه" : "Show full-screen mode"}
          </Button>
          <LocalLoadingOverlay
            isLoading={loading}
            fullScreen
            message={fa ? "نمایش دو ثانیه‌ای" : "Two-second preview"}
          />
        </Example>
      </>
    );
  if (id === "loading-overlay")
    return (
      <Example props="LoadingProvider · openWaitDialog(message) · closeWaitDialog()">
        <LoadingProvider>
          <ContextLoader language={language} />
        </LoadingProvider>
      </Example>
    );
  if (id === "global-loader")
    return (
      <Example props="loadingStore.show() · loadingStore.hide()">
        <StoreLoader language={language} />
      </Example>
    );
  if (id === "table-placeholder")
    return (
      <>
        {[2, 5].map((rowCount) => (
          <Example key={rowCount} props={`rowCount={${rowCount}}`}>
            <TablePlaceholder rowCount={rowCount} />
          </Example>
        ))}
      </>
    );
  if (id === "create-placeholder")
    return (
      <>
        {[1, 3].map((rowCount) => (
          <Example key={rowCount} props={`rowCount={${rowCount}}`}>
            <PreviewFrame>
              <CreatePagePlaceholder rowCount={rowCount} />
            </PreviewFrame>
          </Example>
        ))}
      </>
    );
  if (id === "view-placeholder")
    return (
      <>
        {[3, 8].map((fieldCount) => (
          <Example key={fieldCount} props={`fieldCount={${fieldCount}}`}>
            <PreviewFrame>
              <ViewPagePlaceholder fieldCount={fieldCount} />
            </PreviewFrame>
          </Example>
        ))}
      </>
    );
  if (id === "error-boundary")
    return (
      <Example props="children · onError · render error / healthy">
        <ErrorExample language={language} />
      </Example>
    );
  const retry = () => setMessage(fa ? "تلاش مجدد انجام شد" : "Retry requested");
  return (
    <>
      <Example
        props={
          id === "table-error"
            ? "message · onRetry · colSpan=4"
            : "message · onRetry"
        }
      >
        {id === "table-error" ? (
          <TableErrorState
            message={
              fa
                ? "سرویس نمونه موقتاً در دسترس نیست."
                : "The sample service is temporarily unavailable."
            }
            onRetry={retry}
            colSpan={4}
          />
        ) : (
          <ErrorMessage
            message={
              fa ? "خطای نمونهٔ قابل تلاش مجدد" : "A recoverable sample error"
            }
            onRetry={retry}
          />
        )}
      </Example>
      <Message>{message}</Message>
    </>
  );
}
