import Accordion from "@/core/components/general/Accordion";
import PageTransition from "@/core/components/general/animation/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import PageHeader from "@/core/components/general/container/PageHeader";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { publicMessages } from "@/core/forms/MessageUtils";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React,{ useState } from "react";
import OwnedChannelSearch from "./OwnedChannelSearch";
import OwnedChannelTable from "./OwnedChannelTable";

const OwnedChannelPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const breadcrumbItems = useBreadcrumbs();

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={'همه کانال های من'}
            // actionButton={{
            //   label: OwnedChannelModelMeta.messages.createButton,
            //   permission: "channel:create",
            //   onClick: () => navigate("create"),
            //   variant: "success",
            // }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <OwnedChannelSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <OwnedChannelTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default OwnedChannelPage;
