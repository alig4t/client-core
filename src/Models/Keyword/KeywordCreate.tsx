import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import KeywordService from "./KeywordService";
import { keywordModelMeta } from "./KeywordModel.meta";
import FormInput from "@/core/components/form/FormInput";
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
import ChannelService from "@/Models/Channel/ChannelService";
import UserService from "@/Models/User/UserService";

const keywordSchema = z.object({
  keywordText: Validator.text(),
  coreUser: Validator.notNull(),
  channel: Validator.notNull(),
  messages: Validator.optional(),
});

type KeywordFormData = z.infer<typeof keywordSchema>;

const KeywordCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["keyword", id],
    queryFn: () => KeywordService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: KeywordFormData) => {
      if (isEditMode) {
        return KeywordService.update(Number(id), data);
      }
      return KeywordService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode ? publicMessages.updateSuccess : publicMessages.createSuccess
      );
      navigate(getViewPath(VIEWNAME.KEYWORDS));
    },
    onError: () => {
      toast.error(isEditMode ? publicMessages.updateError : publicMessages.createError);
    },
  });

  const onSubmit = (data: KeywordFormData) => {
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
                ? `ویرایش ${keywordModelMeta.displayName}`
                : `ایجاد ${keywordModelMeta.displayName}`
            }
          />

          <FormWrapper
            schema={keywordSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormAutoComplete
                name="coreUser"
                label={keywordModelMeta.fields.coreUser.label}
                service={UserService}
              />
              <FormAutoComplete
                name="channel"
                label={keywordModelMeta.fields.channel.label}
                service={ChannelService}
              />
              <FormAutoComplete
                name="messages"
                label={keywordModelMeta.fields.messages.label}
                service={MessageService}
                multiple
              />
            </RowContainer>

            <div className="flex gap-4 mt-6 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.KEYWORDS))}
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

export default KeywordCreate;
