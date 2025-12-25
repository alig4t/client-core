import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";


import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";

import { publicMessages } from "@/core/forms/MessageUtils";
import { useLoading } from "@/stores/LoadingContext";
import Button from "@/core/components/general/button/Button";
import KeywordTable from "../Keyword/KeywordTable";
import KeywordSearch from "../Keyword/KeywordSearch";
import { KeywordModelMeta } from "../Keyword/KeywordModel.meta";
const KeywordPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();
    const { openWaitDialog, closeWaitDialog } = useLoading();


    const loagin = () => {
        openWaitDialog("در حال دریافت اطلاعات کاربران و کانال‌ها...");

    }

    return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

          <Button
              variant="secondary"
              // disabled={userMutation.isPending}
              onClick={loagin}
              className="mb-4"
          >
              دریافت اطلاعات از چند سرویس (Global Loading)
          </Button>

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit lg:max-w-6xl mx-auto">
          <PageHeader
            title={routeMeta?.label || KeywordModelMeta.messages.manage.title}
            actionButton={{
              label: KeywordModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <KeywordSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <KeywordTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default KeywordPage;
