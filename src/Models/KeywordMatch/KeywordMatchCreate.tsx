import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import KeywordMatchService from "./KeywordMatchService";
import { keywordMatchModelMeta } from "./KeywordMatchModel.meta";
import FormInput from "@/core/components/form/FormInput";
import { FormAutoComplete } from "@/core/components/form/FormAutoComplete";
import { DateInput } from "@/core/components/form/DateInput";
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
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";
import ButtonPanel from "@/core/components/general/button/ButtonPanel";
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import { messagingPlatformModelMeta } from "@/Models/MessagingPlatform/MessagingPlatformModel.meta";
import KeywordService from "@/Models/Keyword/KeywordService";
import { keywordModelMeta } from "@/Models/Keyword/KeywordModel.meta";
import UserService from "@/Models/User/UserService";
import { userModelMeta } from "@/Models/User/UserModel.meta";

const keywordMatchSchema = z.object({
  matchedAt: Validator.notNull(),
  message: Validator.notNull(),
  keyword: Validator.notNull(),
  coreUser: Validator.notNull(),
});

type KeywordMatchFormData = z.infer<typeof keywordMatchSchema>;

const KeywordMatchCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["keywordMatch", id],
    queryFn: () => KeywordMatchService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: KeywordMatchFormData) => {
      if (isEditMode) {
        return KeywordMatchService.update(Number(id), data);
      }
      return KeywordMatchService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? keywordMatchModelMeta.messages.update.success.title
          : keywordMatchModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? keywordMatchModelMeta.messages.update.success.description
            : keywordMatchModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["keywordMatch"] });
      navigate(getViewPath(VIEWNAME.KEYWORD_MATCH_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? keywordMatchModelMeta.messages.update.error.title
          : keywordMatchModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? keywordMatchModelMeta.messages.update.error.description
            : keywordMatchModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: KeywordMatchFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.KEYWORD_MATCH_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? keywordMatchModelMeta.messages.pageTitle.edit
      : keywordMatchModelMeta.messages.pageTitle.create
  );

  if (isLoading && isEditMode) {
    return (
      <PageWrapper>
        <CreatePagePlaceholder rowCount={3} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <PageHeader
          title={
            isEditMode
              ? keywordMatchModelMeta.messages.pageTitle.edit
              : keywordMatchModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={keywordMatchSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <DateInput
                name="matchedAt"
                label={keywordMatchModelMeta.fields.matchedAt.label}
              />
              <FormAutoComplete
                name="message"
                label={keywordMatchModelMeta.fields.message.label}
                service={MessagingPlatformService}
                valueKey="id"
                labelKey={messagingPlatformModelMeta.displayField}
              />
              <FormAutoComplete
                name="keyword"
                label={keywordMatchModelMeta.fields.keyword.label}
                service={KeywordService}
                valueKey="id"
                labelKey={keywordModelMeta.displayField}
              />
              <FormAutoComplete
                name="coreUser"
                label={keywordMatchModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={userModelMeta.displayField}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.KEYWORD_MATCH_SEARCH))}
              >
                {publicMessages.form.buttons.cancel}
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={mutation.isPending}
                disabled={mutation.isPending}
              >
                {isEditMode
                  ? publicMessages.form.buttons.update
                  : publicMessages.form.buttons.save}
              </Button>
            </ButtonPanel>
          </FormWrapper>
        </CreatePageFormWrapper>
      </PageTransition>
    </PageWrapper>
  );
};

export default KeywordMatchCreate;
