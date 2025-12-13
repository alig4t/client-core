import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { messagingPlatformModelMeta } from "./MessagingPlatformModel.meta";
import MessagingPlatformSearch from "./MessagingPlatformSearch";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import MessagingPlatformTable from "./MessagingPlatformTable";
import { publicMessages } from "@/core/forms/MessageUtils";

const MessagingPlatformPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={routeMeta?.label || messagingPlatformModelMeta.messages.manage.title}
            actionButton={{
              label: messagingPlatformModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <MessagingPlatformSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <MessagingPlatformTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default MessagingPlatformPage;
