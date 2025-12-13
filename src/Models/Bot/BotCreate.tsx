import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import BotService from "./BotService";
import { botModelMeta } from "./BotModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormSelect } from "@/core/components/form/FormSelect";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import z from "@/core/forms/zod.config";
import Validator from "@/core/forms/validation";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import CreatePagePlaceholder from "@/core/components/general/placeHolder/CreatePagePlaceholder";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import { publicMessages } from "@/core/forms/MessageUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";

const botSchema = z.object({
  token: Validator.text(),
  status: Validator.select(),
  platform: Validator.notNull(),
});

type BotFormData = z.infer<typeof botSchema>;

const BotCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["bot", id],
    queryFn: () => BotService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: BotFormData) => {
      if (isEditMode) {
        return BotService.update(Number(id), data);
      }
      return BotService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? publicMessages.updateSuccess : publicMessages.createSuccess
      );
      navigate(getViewPath(VIEWNAME.BOTS));
    },
    onError: () => {
      toast.error(isEditMode ? publicMessages.updateError : publicMessages.createError);
    },
  });

  const onSubmit = (data: BotFormData) => {
    mutation.mutate(data);
  };

  if (isEditMode && isLoading) {
    return <CreatePagePlaceholder />;
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={
              isEditMode
                ? `ویرایش ${botModelMeta.displayName}`
                : `ایجاد ${botModelMeta.displayName}`
            }
          />

          <FormWrapper
            schema={botSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormAutoComplete
                name="platform"
                label={botModelMeta.fields.platform.label}
                service={MessagingPlatformService}
              />
            </RowContainer>

            <div className="flex gap-4 mt-6 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.BOTS))}
              >
                {publicMessages.cancel}
              </Button>
              <Button type="submit" loading={mutation.isPending}>
                {isEditMode ? publicMessages.update : publicMessages.create}
              </Button>
            </div>
          </FormWrapper>
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default BotCreate;
