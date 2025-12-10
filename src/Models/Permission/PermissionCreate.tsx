// src/pages/PermissionCreate.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import permissionService from "@/Models/Permission/PermissionService";
import Spinner from "@/core/components/general/Spinner";
// import { FormWrapper } from "@/components/shared/FormWrapper";
import { PermissionModelMeta } from "./PermissionModel.meta";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import FormInput from "@/core/components/form/FormInput";
import Validator from "@/core/forms/validation";
import PermissionService from "@/Models/Permission/PermissionService";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/router/RouteUtils";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import PageHeader from "@/core/components/general/PageHeader";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { PageWrapper } from "@/core/components/general/PageWrapper";
import TablePlaceholder from "@/core/components/general/TablePlaceholder";
import PageTransition from "@/core/components/general/PageTransition";
import { RowContainer } from "@/core/components/general/RowContainer";
import ButtonPanel from "@/core/components/general/ButtonPanel";
import Button from "@/core/components/general/Button";


const permissionSchema = z.object({
  showName: Validator.notNull(),
  name: Validator.notNull(),

});
type PermissionFormData = z.infer<typeof permissionSchema>;


// --- Main Component for Create Permission Page ---
const PermissionCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const queryClient = useQueryClient();
  const isEditMode = !!id; // Detect edit mode

  // Load data in edit mode
  const { data: initialData, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["permission", id],
    queryFn: () => PermissionService.getById(Number(id)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: PermissionFormData) => {
      if (isEditMode) {
        return PermissionService.update(Number(id), data);
      }
      return PermissionService.create(data);
    },
    onSuccess: (data) => {
      toast.success(
        isEditMode
          ? PermissionModelMeta.messages.update.success.title
          : PermissionModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? PermissionModelMeta.messages.update.success.description
            : PermissionModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["permission"] });
      navigate(getViewPath(VIEWNAME.PERMISSION_LIST));
    },
    onError: (error: any) => {
      toast.error(
        isEditMode
          ? PermissionModelMeta.messages.update.error.title
          : PermissionModelMeta.messages.create.error.title,
        {
          description:
            error?.message ||
            (isEditMode
              ? PermissionModelMeta.messages.update.error.defaultDescription
              : PermissionModelMeta.messages.create.error
                .defaultDescription),
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: PermissionFormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.PERMISSION_LIST));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode ? "ویرایش دسترسی" : "ایجاد دسترسی جدید"
  );

  const routeMeta = useRouteMetadata();
  if (isLoadingInitial && isEditMode) {
    return (
      <PageWrapper>
        <TablePlaceholder rowCount={1} />
      </PageWrapper>
    );
  }

  return (

    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="sm:p-8 min-h-screen font-sans">
          <PageHeader
            title={routeMeta?.label || (isEditMode ? "ویرایش دسترسی" : "ایجاد دسترسی جدید")}
          />

          <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-2xl mx-auto">
            <FormWrapper
              schema={permissionSchema}
              onSubmit={onSubmit}
              className="space-y-6"
              defaultValues={initialData}
            >

              <RowContainer numberOfColumns={2}>
                <FormInput
                  type="text"
                  name="showName"
                  label={PermissionModelMeta.fields.showName?.label}
                  placeholder={
                    PermissionModelMeta.fields.showName?.placeholder
                  }
                />
                <FormInput
                  type="text"
                  name="name"
                  label={PermissionModelMeta.fields.name?.label}
                  placeholder={
                    PermissionModelMeta.fields.name?.placeholder
                  }
                />
              </RowContainer>

              {/* <PermissionFormFields /> */}

              <ButtonPanel align="end">
                <Button variant="cancel" onClick={handleCancel}>
                  لغو
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  loading={mutation.isPending}
                  disabled={mutation.isPending}
                >
                  {isEditMode ? "به‌روزرسانی" : "ذخیره"}
                </Button>
              </ButtonPanel>
            </FormWrapper>
          </div>
        </div>

      </PageTransition>
    </PageWrapper>
  );
};

export default PermissionCreate;
