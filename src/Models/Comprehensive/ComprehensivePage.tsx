import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";


import PageTransition from "@/core/components/general/animation/PageTransition";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import PageHeader from "@/core/components/general/container/PageHeader";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";

import Button from "@/core/components/general/button/Button";
import { publicMessages } from "@/core/forms/MessageUtils";
import { useLoading } from "@/stores/LoadingContext";
import { KeywordModelMeta } from "../Keyword/KeywordModel.meta";
import KeywordSearch from "../Keyword/KeywordSearch";
import KeywordTable from "../Keyword/KeywordTable";
const KeywordPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();
    const { openWaitDialog } = useLoading();


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
              permission: "comprehensive:create",
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
