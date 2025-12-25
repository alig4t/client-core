import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import PersonService from "./PersonService";
import { PersonModelMeta } from "./PersonModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";

const PersonDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: personRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["person", id],
    queryFn: () => PersonService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.PERSON_EDIT, id));
    navigate(getViewPath(VIEWNAME.PERSON_EDIT, id));
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <ViewPagePlaceholder />
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <TableErrorState
          message={(error as Error)?.message || "خطا در بارگذاری داده‌ها"}
          onRetry={refetch}
        />
      </PageWrapper>
    );
  }

  if (!personRecord) {
    return (
      <PageWrapper>
        <TableErrorState message={publicMessages.record.notfound} onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={publicMessages.record.displayTitle + " : " + personRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={PersonModelMeta.fields.firstName.label}
            value={personRecord.firstName}
          />
          <DisplayField
            label={PersonModelMeta.fields.lastName.label}
            value={personRecord.lastName}
          />
          <DisplayField
            label={PersonModelMeta.fields.nationalId.label}
            value={personRecord.nationalId}
          />
          <DisplayField
            label={PersonModelMeta.fields.birthDate.label}
            value={DateUtil.GEORGIAN_TO_JALALI(personRecord.birthDate)}
          />
          <DisplayField
            label={PersonModelMeta.fields.coreUser.label}
            value={
              personRecord.coreUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={personRecord.coreUser.id}
                  label={personRecord.coreUser.username}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={PersonModelMeta.fields.city.label}
            value={
              personRecord.city ? (
                <LinkView
                  viewName={VIEWNAME.CITY_DISPLAY}
                  id={personRecord.city.id}
                  label={personRecord.city.cityName}
                />
              ) : (
                "---"
              )
            }
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default PersonDisplay;
