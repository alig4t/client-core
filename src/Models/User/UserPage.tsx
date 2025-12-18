import React, { useState } from "react";
import Accordion from "@/core/components/general/Accordion";
import { type DynamicFilters } from "@/core/forms/DynamicFilterForm";

import { useNavigate } from "react-router-dom";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";

import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";


import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";

import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { publicMessages } from "@/core/forms/MessageUtils";
import { UserModelMeta } from "./UserModel.meta";
import UserSearch from "./UserSearch";
import UserTable from "./UserTable";

const UserPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<DynamicFilters>({});
  const navigate = useNavigate();
  const breadcrumbItems = useBreadcrumbs();
  const routeMeta = useRouteMetadata();

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        <div className="sm:p-8 min-h-screen font-sans mix-w-fit mx-auto">
          <PageHeader
            title={routeMeta?.label || UserModelMeta.messages.manage.title}
            actionButton={{
              label: UserModelMeta.messages.createButton,
              onClick: () => navigate("create"),
              variant: "success",
            }}
          />
          <Accordion title={publicMessages.form.filters.title} startOpen={true}>
            <UserSearch onApplyFilters={setActiveFilters} />
          </Accordion>

          <UserTable filters={activeFilters} />
        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default UserPage;
