import { zodResolver } from "@hookform/resolvers/zod";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type Path,
  type Resolver,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import type { ZodTypeAny } from "zod/v3";
import { ApiError } from "../../service/contracts";
import { UNSAFE_DataRouterContext, useBlocker } from "react-router-dom";
const FormActivityContext = createContext({
  pendingUploads: 0,
  startUpload: () => {},
  finishUpload: () => {},
});
export const useFormActivity = () => useContext(FormActivityContext);
function NavigationGuard({ active }: { active: boolean }) {
  const blocker = useBlocker(active);
  useEffect(() => {
    if (blocker.state === "blocked") {
      if (window.confirm("تغییرات ذخیره نشده‌اند. خارج می‌شوید؟"))
        blocker.proceed();
      else blocker.reset();
    }
  }, [blocker]);
  return null;
}
export type searchFilters = Record<string, unknown>;
interface FormWrapperProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit: SubmitHandler<T>;
  schema?: ZodTypeAny;
  defaultValues?: DefaultValues<T>;
  className?: string;
  onFormReady?: (methods: UseFormReturn<T>) => void;
  recordKey?: string | number;
  guardUnsaved?: boolean;
}
export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className = "",
  onFormReady,
  recordKey,
  guardUnsaved = false,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? (zodResolver(schema) as Resolver<T>) : undefined,
    defaultValues,
    mode: "onTouched",
  });
  const [pendingUploads, setPendingUploads] = useState(0);
  const activity = useMemo(
    () => ({
      pendingUploads,
      startUpload: () => setPendingUploads((count) => count + 1),
      finishUpload: () => setPendingUploads((count) => Math.max(0, count - 1)),
    }),
    [pendingUploads],
  );
  const initialKey = useRef(recordKey);
  const dataRouter = useContext(UNSAFE_DataRouterContext);
  const {
    reset,
    formState: { isDirty },
  } = methods;
  useEffect(() => {
    onFormReady?.(methods);
  }, [onFormReady, methods]);
  useEffect(() => {
    if (initialKey.current !== recordKey) {
      reset(defaultValues);
      initialKey.current = recordKey;
    }
  }, [recordKey, defaultValues, reset]);
  useEffect(() => {
    if (!guardUnsaved || !isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [guardUnsaved, isDirty]);
  return (
    <FormActivityContext.Provider value={activity}>
      <FormProvider {...methods}>
        {dataRouter && (
          <NavigationGuard
            active={guardUnsaved && isDirty && !methods.formState.isSubmitting}
          />
        )}
        <form
          noValidate
          className={className}
          onSubmit={methods.handleSubmit(async (data) => {
            methods.clearErrors("root");
            if (pendingUploads) {
              methods.setError("root.server", {
                message: "منتظر پایان بارگذاری فایل بمانید",
              });
              return;
            }
            try {
              await onSubmit(data);
            } catch (error) {
              if (error instanceof ApiError) {
                Object.entries(error.fieldErrors).forEach(([name, message]) =>
                  methods.setError(name as Path<T>, {
                    type: "server",
                    message,
                  }),
                );
                methods.setError("root.server", {
                  type: "server",
                  message: error.message,
                });
              } else
                methods.setError("root.server", {
                  type: "server",
                  message:
                    error instanceof Error
                      ? error.message
                      : "خطا در ذخیره اطلاعات",
                });
            }
          })}
        >
          {methods.formState.errors.root?.server?.message && (
            <p role="alert" className="text-red-600">
              {methods.formState.errors.root.server.message}
            </p>
          )}
          {children}
        </form>
      </FormProvider>
    </FormActivityContext.Provider>
  );
}
