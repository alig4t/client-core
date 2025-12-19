import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useNavigate } from "react-router-dom";
import PlatformSearch from "./PlatformSearch";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { platformModelMeta } from "./PlatformModel.meta";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import PlatformTable from "./PlatformTable";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { publicMessages } from "@/core/forms/MessageUtils";

const PlatformPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <PageHeader
            title={routeMeta?.label || platformModelMeta.messages.manage.title}
            actionButton={{
              label: platformModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen>
            <PlatformSearch onApplyFilters={setActiveFilters} />
          </Accordion>
          <PlatformTable filters={activeFilters} />
      </PageTransition>
    </PageWrapper>
  );
};

export default PlatformPage;