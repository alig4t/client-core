import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import CityService from "./CityService";
import { cityModelMeta } from "./CityModel.meta";
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

const CityDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();

  const {
    data: cityRecord,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["city", id],
    queryFn: () => CityService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  if (isLoading) return <ViewPagePlaceholder />;
  if (isError) return <TableErrorState />;

  return (
    <PageWrapper>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <RecordDisplayLayout
        title={cityModelMeta.displayName}
        onEdit={() => navigate(getViewPath(VIEWNAME.CITY_EDIT, id))}
        onBack={() => navigate(getViewPath(VIEWNAME.CITYS))}
      >
        <RowContainer>
          <DisplayField
            label={cityModelMeta.fields.cityName.label}
            value={cityRecord?.cityName}
          />
          <DisplayField
            label={cityModelMeta.fields.country.label}
            value={cityRecord?.country}
          />
        </RowContainer>
      </RecordDisplayLayout>
    </PageWrapper>
  );
};

export default CityDisplay;
