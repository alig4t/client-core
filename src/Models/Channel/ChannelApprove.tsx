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
import OwnedChannelService from "./OwnedChannelService";
import LinkView from "@/core/components/general/link/LinkView";
import { VIEWNAME } from "@/router/ViewName";

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
      const response =
        await PlatformAuthorizationControllerService.authorizationsByStatus("PENDING");

      const enrichedResponse = await Promise.all(
        response.map(async (row: any) => {
          const ownChannel = await OwnedChannelService.getById(row.ownedChannelId);
          return {
            ...row,
            ownChannel,
          };
        })
      );

      return enrichedResponse as Authorization[];
    },
    refetchInterval: 10000,
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
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-[var(--text-secondary)]">در حال بارگذاری...</p>
              </div>
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
            <div className="text-center py-12 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-sm p-8">
              <div className="w-48 h-48 mx-auto mb-6">
                <Lottie
                  animationData={chatBotAnimation}
                  loop={true}
                  autoplay={true}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">کانالی در انتظار تایید نیست</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                در حال حاضر هیچ کانالی برای تایید وجود ندارد
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-[var(--text-secondary)]">
                  کانال‌های جدید به صورت خودکار در این صفحه نمایش داده می‌شوند
                </p>
              </div>
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
                className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01]"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left section - Info */}
                  <div className="flex-1 space-y-4">
                    {/* Channel Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{auth.chatTitle}</h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {/* Platform */}
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <User className="w-4 h-4" strokeWidth={2} />
                        <span>پلتفرم:</span>
                        <span className="font-medium text-[var(--text-primary)]">{(auth as any).platform.platformKey}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        <span>وضعیت:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium">
                          در انتظار تایید
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <User className="w-4 h-4" strokeWidth={2} />
                        <span>سازنده:</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          
                          <LinkView viewName={VIEWNAME.USER_DISPLAY} id={(auth as any).ownChannel?.ownerId} label={(auth as any).ownChannel?.ownerName}  />
                          {/* {(auth as any).ownChannel?.ownerName} */}
                          
                          </span>
                      </div>


                      {/* Created At */}
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4" strokeWidth={2} />
                        <span>تاریخ ایجاد:</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {formatDate(auth.createdAt)}
                        </span>
                      </div>

                      {/* Authorization Type */}
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <span>نوع:</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {auth.authorizationType === "MONITORING_CHANNEL"
                            ? "کانال نظارتی"
                            : "کانال اطلاع‌رسانی"}
                        </span>
                      </div>
                    </div>

                    {/* Verification Code */}
                    {auth.verificationCode && (
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <span className="text-xs font-medium text-[var(--text-secondary)] block mb-2">کد تایید:</span>
                        <code className="block text-base font-mono text-blue-600 dark:text-blue-400 font-bold tracking-wider select-all">
                          {auth.verificationCode}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Right section - Actions */}
                  <div className="flex flex-col gap-3">
                    <Button
                      variant="success"
                      onClick={() => handleApprove(auth.id)}
                      disabled={processingId === auth.id}
                      loading={processingId === auth.id && approveMutation.isPending}
                      icon={CheckCircle}
                      className="min-w-[130px]"
                    >
                      تایید کانال
                    </Button>
                    <Button
                      variant="cancel"
                      onClick={() => handleReject(auth.id)}
                      disabled={processingId === auth.id}
                      loading={processingId === auth.id && rejectMutation.isPending}
                      icon={XCircle}
                      className="min-w-[130px]"
                    >
                      رد درخواست
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer */}
          <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-950 border-r-4 border-blue-500 rounded-[10px_1px_1px_10px] shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  تعداد کانال‌های در انتظار تایید:
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2 text-lg">{pendingAuthorizations.length}</span>
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  این لیست هر 10 ثانیه به‌روزرسانی می‌شود
                </p>
              </div>
            </div>
          </div>
        </CreatePageFormWrapper>
      </PageTransition>
    </PageWrapper>
  );
};

export default ChannelApprove;
