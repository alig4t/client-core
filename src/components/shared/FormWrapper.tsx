import type { ReactNode } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormWrapperProps<T extends z.ZodTypeAny> = {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: SubmitHandler<z.infer<T>>;
  children: ReactNode;
};

export function FormWrapper<T extends z.ZodTypeAny>({
  schema,
  defaultValues = {},
  onSubmit,
  children,
}: FormWrapperProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as z.infer<T>,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
