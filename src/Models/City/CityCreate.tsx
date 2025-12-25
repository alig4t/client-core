import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FormWrapper } from "@/core/components/form/FormWrapper";
import CityService from "./CityService";
import { CityModelMeta } from "./CityModel.meta";
import FormInput from "@/core/components/form/FormInput";
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

const citySchema = z.object({
  cityName: Validator.notNull(),
  country: Validator.notNull(),
});

type CityFormData = z.infer<typeof citySchema>;

const CityCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const routeMeta = useRouteMetadata();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading } = useQuery({
    queryKey: ["city", id],
    queryFn: () => CityService.getById(Number(id!)),
    enabled: isEditMode,
    ...ReactQueryOptions.editOptions,
  });

  const mutation = useMutation({
    mutationFn: (data: CityFormData) => {
      if (isEditMode) {
        return CityService.update(Number(id), data);
      }
      return CityService.create(data);
    },
    onSuccess: () => {
      toast.success(
        isEditMode
          ? CityModelMeta.messages.update.success.title
          : CityModelMeta.messages.create.success.title,
        {
          description: isEditMode
            ? CityModelMeta.messages.update.success.description
            : CityModelMeta.messages.create.success.description,
          position: "bottom-left",
        }
      );
      queryClient.invalidateQueries({ queryKey: ["city"] });
      navigate(getViewPath(VIEWNAME.CITY_SEARCH));
    },
    onError: () => {
      toast.error(
        isEditMode
          ? CityModelMeta.messages.update.error.title
          : CityModelMeta.messages.create.error.title,
        {
          description: isEditMode
            ? CityModelMeta.messages.update.error.description
            : CityModelMeta.messages.create.error.description,
          position: "bottom-left",
        }
      );
    },
  });

  const onSubmit = (data: CityFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    navigate(getViewPath(VIEWNAME.CITY_SEARCH));
  };

  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? CityModelMeta.messages.pageTitle.edit
      : CityModelMeta.messages.pageTitle.create
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
              ? CityModelMeta.messages.pageTitle.edit
              : CityModelMeta.messages.pageTitle.create
          }
        />
        <CreatePageFormWrapper>
          <FormWrapper
            schema={citySchema}
            onSubmit={onSubmit}
            defaultValues={existingData}
          >
            <RowContainer>
              <FormInput
                name="cityName"
                label={CityModelMeta.fields.cityName.label}
                placeholder={CityModelMeta.fields.cityName.placeholder}
                maxLength={100}
              />
              <FormInput
                name="country"
                label={CityModelMeta.fields.country.label}
                placeholder={CityModelMeta.fields.country.placeholder}
                maxLength={100}
              />
            </RowContainer>

            <ButtonPanel align="end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(getViewPath(VIEWNAME.CITY_SEARCH))}
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

export default CityCreate;
