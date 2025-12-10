// src/pages/ComprehensiveCreate.tsx
import React from "react";
import { useRouteMetadata } from "@/core/hooks/useRouteMetadata";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "@/core/forms/zod.config";
import Button from "@/core/components/general/Button";
import PageHeader from "@/core/components/general/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";

import Validator from "@/core/forms/validation";
import { PageWrapper } from "@/core/components/general/PageWrapper";
import PageTransition from "@/core/components/general/PageTransition";
import { useLoading } from "@/stores/LoadingContext";
import UserService from "@/Models/User/UserService";
import ChannelService from "@/Models/Channel/ChannelService";
import { comprehensiveModelMeta } from "@/Models/Comprehensive/ComprehensiveModel.meta";

const comprehensiveSchema = z.object({
  stringField: Validator.optional(),
  integerField: Validator.optional(),
  indexedField: Validator.optional(),
  longField: Validator.optional(),
  doubleField: Validator.optional(),
  bigDecimalField: Validator.optional(),
  booleanField: Validator.optional(),
  dateField: Validator.optional(),
  enumField: Validator.optional(),
  oneToOneUser: Validator.optional(),
  manyToOneChannel: Validator.optional(),
  uniqueField: Validator.optional(),
  attachmentIds: Validator.optional(), // Change to attachments
});

type ComprehensiveFormData = z.infer<typeof comprehensiveSchema>;

const ComprehensiveCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get id from URL
  const queryClient = useQueryClient();
  const isEditMode = !!id; // Detect edit mode
  const { openWaitDialog, closeWaitDialog } = useLoading();


  const userMutation = useMutation({
    mutationFn: async (channelId: number) => {
      openWaitDialog("در حال دریافت اطلاعات کاربران و کانال‌ها...");

      const users = await UserService.getAll();

      let params = {
        page: 0,
        filters: { channelName_like: "امنیتی" } as any
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
    onError: (error: any) => {
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
