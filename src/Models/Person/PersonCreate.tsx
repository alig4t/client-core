import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import PersonService from "./PersonService";
import { PersonModelMeta } from "./PersonModel.meta";
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
import UserService from "@/Models/User/UserService";
import { UserModelMeta } from "@/Models/User/UserModel.meta";
import CityService from "@/Models/City/CityService";
import { CityModelMeta } from "@/Models/City/CityModel.meta";

const personSchema = z.object({
  firstName: Validator.notNull(),
  lastName: Validator.notNull(),
  nationalId: Validator.optional(),
  birthDate: Validator.optional(),
  coreUser: Validator.notNull(),
  city: Validator.optional(),
});

type PersonFormData = z.infer<typeof personSchema>;

const PersonCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["person", id],
    queryFn: () => PersonService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: PersonFormData) => {
      if (isEditMode) {
        return PersonService.update(Number(id), data);
      }
      return PersonService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? PersonModelMeta.messages.update.success.title
          : PersonModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? PersonModelMeta.messages.update.success.description
            : PersonModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["person"] });
      navigate(getViewPath(VIEWNAME.PERSON_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? PersonModelMeta.messages.update.error.title
          : PersonModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? PersonModelMeta.messages.update.error.description
            : PersonModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: PersonFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.PERSON_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? PersonModelMeta.messages.pageTitle.edit
      : PersonModelMeta.messages.pageTitle.create
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
              ? PersonModelMeta.messages.pageTitle.edit
              : PersonModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={personSchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="firstName"
                label={PersonModelMeta.fields.firstName.label}
                placeholder={PersonModelMeta.fields.firstName.placeholder}
                maxLength={100}
              />
              <FormInput
                name="lastName"
                label={PersonModelMeta.fields.lastName.label}
                placeholder={PersonModelMeta.fields.lastName.placeholder}
                maxLength={100}
              />
              <FormInput
                name="nationalId"
                label={PersonModelMeta.fields.nationalId.label}
                placeholder={PersonModelMeta.fields.nationalId.placeholder}
                maxLength={20}
              />
              <DateInput
                name="birthDate"
                label={PersonModelMeta.fields.birthDate.label}
              />
              <FormAutoComplete
                name="coreUser"
                label={PersonModelMeta.fields.coreUser.label}
                service={UserService}
                valueKey="id"
                labelKey={UserModelMeta.displayField}
              />
              <FormAutoComplete
                name="city"
                label={PersonModelMeta.fields.city.label}
                service={CityService}
                valueKey="id"
                labelKey={CityModelMeta.displayField}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.PERSON_SEARCH))}
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

export default PersonCreate;
