import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { CheckCircle, XCircle, Clock, MessageSquare, User, Calendar } from "lucide-react";
import Lottie from "lottie-react";
import { ChannelModelMeta } from "./ChannelModel.meta";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";
import PlatformAuthorizationControllerService from "../MessagingPlatform/PlatformAuthorizationControllerService";
import chatBotAnimation from "@/components/pages/channel/ChatBot.json";

interface Authorization {
  id: number;
  chatTitle: string;
  platformKey: string;
  authorizationType: string;
  status: string;
  verificationCode?: string;
  createdAt: string;
  updatedAt?: string;
}

const ChannelApprove: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const breadcrumbItems = useBreadcrumbs("تایید کانال‌ها");

  // Fetch pending authorizations
  const { data: pendingAuthorizations, isLoading, refetch } = useQuery({
    queryKey: ["pending-authorizations"],
    queryFn: async () => {
      const response = await PlatformAuthorizationControllerService.authorizationsByStatus("PENDING");
      return response as Authorization[];
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      return await PlatformAuthorizationControllerService.approveAuthorization(id);
    },
    onSuccess: () => {
      toast.success("کانال با موفقیت تایید شد", {
        description: "کانال اکنون فعال است",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["pending-authorizations"] });
      queryClient.invalidateQueries({ queryKey: ["channel"] });
    },
    onError: () => {
      toast.error("خطا در تایید کانال", {
        description: "لطفا دوباره تلاش کنید",
      });
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      return await PlatformAuthorizationControllerService.rejectAuthorization(id);
    },
    onSuccess: () => {
      toast.success("کانال رد شد", {
        description: "درخواست کانال رد شد",
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["pending-authorizations"] });
    },
    onError: () => {
      toast.error("خطا در رد کردن کانال", {
        description: "لطفا دوباره تلاش کنید",
      });
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const handleApprove = (id: number) => {
    setProcessingId(id);
    approveMutation.mutate(id);
  };

  const handleReject = (id: number) => {
    setProcessingId(id);
    rejectMutation.mutate(id);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Loading state
  if (isLoading) {
    return (
      <PageWrapper>
        <PageTransition>
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <PageHeader title="تایید کانال‌ها" />
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                <Lottie
                  animationData={chatBotAnimation}
                  loop={true}
                  autoplay={true}
                />
              </div>
              <p className="text-gray-600">در حال بارگذاری...</p>
            </div>
          </div>
        </PageTransition>
      </PageWrapper>
    );
  }

  // Empty state
  if (!pendingAuthorizations || pendingAuthorizations.length === 0) {
    return (
      <PageWrapper>
        <PageTransition>
          <Breadcrumb items={breadcrumbItems} className="mb-4" />
          <PageHeader title="تایید کانال‌ها" />
          <CreatePageFormWrapper>
            <div className="text-center py-12">
              <div className="w-48 h-48 mx-auto mb-6">
                <Lottie
                  animationData={chatBotAnimation}
                  loop={true}
                  autoplay={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">کانالی در انتظار تایید نیست</h3>
              <p className="text-gray-600 mb-6">
                در حال حاضر هیچ کانالی برای تایید وجود ندارد
              </p>
            </div>
          </CreatePageFormWrapper>
        </PageTransition>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <PageHeader title="تایید کانال‌ها" />

        <CreatePageFormWrapper>
          <div className="space-y-4">
            {pendingAuthorizations.map((auth) => (
              <div
                key={auth.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left section - Info */}
                  <div className="flex-1 space-y-3">
                    {/* Channel Title */}
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">{auth.chatTitle}</h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {/* Platform */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>پلتفرم:</span>
                        <span className="font-medium text-gray-900">{auth.platformKey}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>وضعیت:</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                          در انتظار تایید
                        </span>
                      </div>

                      {/* Created At */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>تاریخ ایجاد:</span>
                        <span className="font-medium text-gray-900">
                          {formatDate(auth.createdAt)}
                        </span>
                      </div>

                      {/* Authorization Type */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>نوع:</span>
                        <span className="font-medium text-gray-900">
                          {auth.authorizationType === "MONITORING_CHANNEL"
                            ? "کانال نظارتی"
                            : "کانال اطلاع‌رسانی"}
                        </span>
                      </div>
                    </div>

                    {/* Verification Code */}
                    {auth.verificationCode && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <span className="text-xs text-gray-600">کد تایید:</span>
                        <code className="block mt-1 text-sm font-mono text-blue-600 font-semibold">
                          {auth.verificationCode}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Right section - Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="success"
                      onClick={() => handleApprove(auth.id)}
                      disabled={processingId === auth.id}
                      loading={processingId === auth.id && approveMutation.isPending}
                      icon={CheckCircle}
                      className="min-w-[120px]"
                    >
                     
                      تایید
                    کانال
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(auth.id)}
                      disabled={processingId === auth.id}
                      loading={processingId === auth.id && rejectMutation.isPending}
                      icon={XCircle}
                      className="min-w-[120px]"
                    >
                     
                      رد
                    درخواست
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              تعداد کانال‌های در انتظار تایید:
              <span className="font-bold mr-2">{pendingAuthorizations.length}</span>
            </p>
          </div>
        </CreatePageFormWrapper>
      </PageTransition>
    </PageWrapper>
  );
};

export default ChannelApprove;
