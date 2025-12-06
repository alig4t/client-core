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

export interface searchFilters {
  [key: string]: any;
}

// --- Props with precise types ---
interface FormWrapperProps<T extends FieldValues> {
  children: React.ReactNode;
  onSubmit: SubmitHandler<T>;
  schema?: ZodSchema<T>; // ZodSchema exactly for type T
  defaultValues?: DefaultValues<T>; // Correct type for default values
  className?: string;
  onFormReady?: (methods: ReturnType<typeof useForm<T>>) => void;
}

// --- Main Component ---
export function FormWrapper<T extends FieldValues>({
  children,
  onSubmit,
  schema,
  defaultValues,
  className = "",
  onFormReady,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
    mode: "onTouched",
  });

  React.useEffect(() => {
    if (onFormReady) {
      onFormReady(methods);
    }
  }, [onFormReady, methods]);

  const handleSubmit = methods.handleSubmit((data: T) => {
    onSubmit(data); // Now data is exactly of type T
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
