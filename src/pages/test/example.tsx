// src/pages/ComprehensiveCreate.tsx
import Breadcrumb from "@/core/components/general/BreadCrumb";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import PageTransition from "@/core/components/general/animation/PageTransition";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import ChannelService from "@/Models/Channel/ChannelService";
import { comprehensiveModelMeta } from "@/Models/Comprehensive/ComprehensiveModel.meta";
import UserService from "@/Models/User/UserService";
import { useLoading } from "@/stores/LoadingContext";



const ComprehensiveCreate: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const isEditMode = !!id; // Detect edit mode
  const { openWaitDialog, closeWaitDialog } = useLoading();


  const userMutation = useMutation({
    mutationFn: async (_channelId: number) => {
      openWaitDialog("در حال دریافت اطلاعات کاربران و کانال‌ها...");

      const users = await UserService.getAll();

      const params = {
        page: 0,
        filters: { channelName_like: "امنیتی" }
      }

      const channel = await ChannelService.getAll(params);
      return { users, channel };
    },
    onSuccess: (data) => {
      closeWaitDialog();
      console.log("Users:", data.users);
      console.log("Channels:", data.channel);
      toast.success("اطلاعات با موفقیت دریافت شد", {
        position: "bottom-left",
      });
    },
    onError: (error: Error) => {
      closeWaitDialog();
      toast.error("خطا در دریافت اطلاعات", {
        description: error?.message || "مشکلی در دریافت اطلاعات به وجود آمد",
        position: "bottom-left",
      });
    }
  });


  const breadcrumbItems = useBreadcrumbs(
    isEditMode
      ? comprehensiveModelMeta.messages.pageTitle.edit
      : comprehensiveModelMeta.messages.pageTitle.create
  );
  const routeMeta = useRouteMetadata();

  

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <div className="sm:p-8 min-h-screen font-sans">
          <PageHeader
            title={routeMeta?.label || (
              isEditMode
                ? comprehensiveModelMeta.messages.pageTitle.edit
                : comprehensiveModelMeta.messages.pageTitle.create
            )}
          />

          {/* Example: Button to test global loading dialog with multiple service calls */}
          <Button
            variant="secondary"
            disabled={userMutation.isPending}
            onClick={() => userMutation.mutate(1)}
            className="mb-4"
          >
            دریافت اطلاعات از چند سرویس (Global Loading)
          </Button>

        </div>
      </PageTransition>
    </PageWrapper>
  );
};

export default ComprehensiveCreate;
