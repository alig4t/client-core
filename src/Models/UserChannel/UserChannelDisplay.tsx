import React from "react";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RecordDisplayLayout } from "@/core/components/general/container/RecordDisplayLayout";
import { RowContainer } from "@/core/components/general/container/RowContainer";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";
import { DisplayField } from "@/core/components/general/container/DisplayField";
import UserChannelService from "./UserChannelService";
import { userChannelModelMeta } from "./UserChannelModel.meta";
import OptionUtils from "@/core/forms/OptionUtils";
import DateUtil from "@/core/forms/DateUtils";
import TableErrorState from "@/core/components/general/TableErrorState";
import Button from "@/core/components/general/button/Button";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import { getViewPath } from "@/core/router/RouteUtils";
import { UserChannelRoleEnumLabels } from "./UserChannelRoleEnum";
import { ReactQueryOptions } from "@/core/service/ReactQueryOptions";
import ViewPagePlaceholder from "@/core/components/general/placeHolder/ViewPagePlaceholder";
import { publicMessages } from "@/core/forms/MessageUtils";

const UserChannelDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: userChannelRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userChannel", id],
    queryFn: () => UserChannelService.getById(Number(id!)),
    enabled: !!id,
    ...ReactQueryOptions.displayOptions,
  });

  // Breadcrumb for navigation
  const breadcrumbItems = useBreadcrumbs(publicMessages.record.displayTitle);

  // Handler for edit button
  const handleEditClick = () => {
    console.log(getViewPath(VIEWNAME.USER_CHANNEL_EDIT, id));
    navigate(getViewPath(VIEWNAME.USER_CHANNEL_EDIT, id));
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

  if (!userChannelRecord) {
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
        title={publicMessages.record.displayTitle + " : " + userChannelRecord.id}
        actions={
          <Button variant="primary" onClick={handleEditClick}>
            ویرایش
          </Button>
        }
      >
        <RowContainer numberOfColumns={3}>
          <DisplayField
            label={userChannelModelMeta.fields.role.label}
            value={OptionUtils.getLabel(
              userChannelRecord.role,
              UserChannelRoleEnumLabels
            )}
          />
          <DisplayField
            label={userChannelModelMeta.fields.coreUser.label}
            value={
              userChannelRecord.coreUser ? (
                <LinkView
                  viewName={VIEWNAME.USER_DISPLAY}
                  id={userChannelRecord.coreUser.id}
                  label={userChannelRecord.coreUser.username}
                />
              ) : (
                "---"
              )
            }
          />
          <DisplayField
            label={userChannelModelMeta.fields.channel.label}
            value={
              userChannelRecord.channel ? (
                <LinkView
                  viewName={VIEWNAME.CHANNEL_DISPLAY}
                  id={userChannelRecord.channel.id}
                  label={userChannelRecord.channel.channelName}
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

export default UserChannelDisplay;
