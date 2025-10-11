// src/components/shared/FormWrapper.tsx

import React from "react";
import {
  FormProvider,
  useForm,
  type SubmitHandler,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema, ZodTypeAny } from "zod";

// --- Props با تایپ‌های دقیق ---
interface FormWrapperProps<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  schema?: ZodSchema<T>; // ZodSchema دقیقاً برای همان نوع T
  defaultValues?: DefaultValues<T>; // نوع صحیح برای مقادیر اولیه
  className?: string;
}

// --- کامپوننت اصلی ---
export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className = "",
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
    mode: "onTouched",
  });

  const handleSubmit = methods.handleSubmit((data: T) => {
    onSubmit(data); // حالا data دقیقاً از نوع T است
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
