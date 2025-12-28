import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { MessageSquare, Info, Shield, Copy, AlertTriangle, CheckCircle2, Check, List, MessageCircleMore, CheckIcon, CheckCircleIcon } from "lucide-react";
import Lottie from "lottie-react";
import ChannelService from "./ChannelService";
import { ChannelModelMeta } from "./ChannelModel.meta";
import Button from "@/core/components/general/button/Button";
import PageHeader from "@/core/components/general/container/PageHeader";
import Breadcrumb from "@/core/components/general/BreadCrumb";
import { PageWrapper } from "@/core/components/general/container/PageWrapper";
import PageTransition from "@/core/components/general/animation/PageTransition";
import { VIEWNAME } from "@/router/ViewName";
import { getViewPath } from "@/core/router/RouteUtils";
import CreatePageFormWrapper from "@/core/components/general/container/CreateFormWrapper";
import MessagingPlatformService from "@/Models/MessagingPlatform/MessagingPlatformService";
import CompactStepper, { type CompactStep } from "@/core/components/general/stepper/CompactStepper";
import PlatformAuthorizationControllerService, { type DraftDto } from "../MessagingPlatform/PlatformAuthorizationControllerService";
import chatBotAnimation from "@/components/pages/channel/ChatBot.json";

interface Platform {
  id: number;
  platformKey: string;
  platformName: string;
  iconUrl?: string;
}

const ChannelCreate: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Multi-step state management
  const [currentStep, setCurrentStep] = useState(0);
  const [channelName, setChannelName] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch available platforms
  const { data: platforms, isLoading: loadingPlatforms } = useQuery({
    queryKey: ["messaging-platforms"],
    queryFn: async () => {
      const response = await MessagingPlatformService.getAll();
      return response;
    },
  });

  const breadcrumbItems = useBreadcrumbs("اتصال کانال جدید");

  const steps: CompactStep[] = [
    { id: 0, label: "انتخاب پلتفرم و کانال" },
    { id: 1, label: "دریافت کد امنیتی" },
    { id: 2, label: "تایید نهایی" },
  ];

  // Step 1: Generate verification code
  const handleGenerateCode = async () => {
    if (!selectedPlatform || !channelName.trim()) {
      toast.error("لطفا پلتفرم و نام کانال را وارد کنید");
      return;
    }

    setIsGeneratingCode(true);
    try {
      const dto: DraftDto = {
        chatTitle: channelName,
        platformKey: selectedPlatform.platformKey,
        authorizationType: "MONITORING_CHANNEL",
      };

      const result = await PlatformAuthorizationControllerService.draftAuthorizations(dto);
      setVerificationCode(result.verificationCode);
      setCurrentStep(1);
      toast.success("کد امنیتی با موفقیت ایجاد شد");
    } catch (error) {
      toast.error("خطا در ایجاد کد تایید", {
        description: "به نظر می رسد هنوز کد را وارد نکرده اید",
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Step 2: Copy verification code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    toast.success("کد کپی شد", {
      description: "حالا آن را در کانال خود ارسال کنید",
    });
  };

  // Step 3: Verify and complete
  const handleVerifyAndComplete = async () => {
    setIsVerifying(true);
    try {
      const authorizations = await PlatformAuthorizationControllerService.authorizationsByStatus("PENDING");

      if (authorizations && authorizations.length > 0) {
        setCurrentStep(2);
        setIsCompleted(true);
        toast.success("کانال با موفقیت ثبت شد!", {
          description: "در انتظار تایید ادمین",
        });
      } else {
        toast.error("کد امنیتی یافت نشد", {
          description: "لطفا مطمئن شوید که کد را در کانال ارسال کرده‌اید",
        });
      }
    } catch (error) {
      toast.error("خطا در تایید کانال", {
        description: "لطفا دوباره تلاش کنید",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Render Step 1: Platform Selection & Channel Name
  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
          <MessageSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">پلتفرم خود را انتخاب کنید</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          ابتدا کانال یا گروه خود را در پلتفرم مورد نظر ایجاد کنید
        </p>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium mb-3 text-[var(--text-primary)]">انتخاب پلتفرم</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loadingPlatforms ? (
            <div className="col-span-full text-center py-12 text-[var(--text-secondary)]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>در حال بارگذاری پلتفرم‌ها...</span>
              </div>
            </div>
          ) : (
            platforms?.data?.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`group relative p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedPlatform?.id === platform.id
                    ? "border-[var(--color-primary)] bg-[var(--bg-accent)] shadow-lg scale-[1.02]"
                    : "border-[var(--input-border)] hover:border-[var(--border-focus)] bg-[var(--input-bg)] hover:shadow-md hover:scale-[1.01]"
                }`}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                    selectedPlatform?.id === platform.id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950"
                  }`}>
                    <MessageSquare
                      className={`w-6 h-6 transition-all ${
                        selectedPlatform?.id === platform.id
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                  <div className="font-medium text-sm text-[var(--text-primary)]">{platform.platformName}</div>
                </div>
                {selectedPlatform?.id === platform.id && (
                  <div className="absolute top-2 left-2 z-10">
                    <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Channel Name Input */}
      <div>
        <label className="block text-sm font-medium mb-3 text-[var(--text-primary)]">نام کانال</label>
        <div className="relative">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="نام کانال یا گروه خود را وارد کنید"
            className="w-full px-4 py-3 border-2 border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder:text-[var(--input-placeholder)] rounded-xl focus:ring-2 focus:ring-[var(--input-focus-ring)] focus:border-[var(--border-focus)] transition-all outline-none"
            maxLength={100}
          />
          {channelName && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)]">
              {channelName.length}/100
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border-r-4 border-blue-500 p-5 shadow-sm rounded-[10px_1px_1px_10px]">
        <div className="flex flex-row items-center gap-4">
          {/* <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={2} />
          </div> */}
          <div className="flex-1">
            <p className="text-sm font-semibold mb-2 text-[var(--text-primary)]">دستورالعمل مهم:</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              ابتدا کانال یا گروه جدید خود را در پلتفرم انتخابی ایجاد کنید. سپس ربات 
              
              <strong className="text-[var(--text-primary)] inline-block font-mono bg-blue-100 px-1.5 rounded-xl  mx-2">rnt_social_test_bot@</strong> 
              
              را به آن اضافه کرده و دسترسی ادمین به آن بدهید.
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-secondary)] mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(getViewPath(VIEWNAME.CHANNEL_SEARCH))}
        >
          انصراف
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleGenerateCode}
          loading={isGeneratingCode}
          disabled={!selectedPlatform || !channelName.trim() || isGeneratingCode}
        >
          مرحله بعد
        </Button>
      </div>
    </div>
  );

  // Render Step 2: Display Verification Code
  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <div className="w-32 h-32 mx-auto mb-4">
          <Lottie
            animationData={chatBotAnimation}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">کد امنیتی شما آماده است</h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          این کد را در کانال خود ارسال کنید تا اتصال برقرار شود
        </p>
      </div>

      {/* Verification Code Display */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 dark:bg-blue-700 opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-300 dark:bg-indigo-700 opacity-10 rounded-full blur-3xl" />

        <div className="relative text-center mb-4">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-4">کد تایید امنیتی</label>
          <div className="relative bg-white dark:bg-gray-900 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent opacity-20 rounded-xl" />
            <code className="relative text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-[0.3em] select-all block">
              {verificationCode}
            </code>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleCopyCode}
          className="w-full flex items-center justify-center gap-2 hover:gap-3 transition-all"
        >
          <Copy className="w-4 h-4" />
          کپی کد
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-amber-50 dark:bg-amber-950 border-l-4 border-amber-500 rounded-[1px_10px_10px_1px] p-5 shadow-sm">
        <div className="flex flex-row-reverse items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-3 text-[var(--text-primary)]">مراحل بعدی:</p>
            <ol className="text-sm text-[var(--text-secondary)] space-y-2">
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300">1</span>
                <span className="flex-1">کد بالا را کپی کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300">2</span>
                <span className="flex-1">به کانال یا گروه خود بروید</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300">3</span>
                <span className="flex-1">کد را در آن ارسال کنید</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-300">4</span>
                <span className="flex-1">سپس دکمه "کد را ارسال کردم" را کلیک کنید</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-6 border-t border-[var(--border-secondary)] mt-8">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setCurrentStep(0)}
        >
          بازگشت
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleVerifyAndComplete}
          loading={isVerifying}
          disabled={isVerifying}
          className="flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          کد را ارسال کردم
        </Button>
      </div>
    </div>
  );

  // Render Step 3: Success State
  const renderStep3 = () => (
    <div className="space-y-8 text-center py-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 bg-green-200 dark:bg-green-900 opacity-20 rounded-full blur-3xl" />
        </div>
        <div className="relative w-48 h-48 mx-auto mb-4">
          <Lottie
            animationData={chatBotAnimation}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" strokeWidth={2} />
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">کانال با موفقیت ثبت شد!</h3>
        </div>
        <p className="text-[var(--text-secondary)] text-lg">
          کانال شما در انتظار تایید ادمین است.
        </p>
      </div>

      <div className="bg-green-50 dark:bg-green-950 border-r-4 border-green-500 rounded-[10px_1px_1px_10px] p-6 max-w-md mx-auto shadow-sm">
        <div className="flex flex-row-reverse items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Info className="w-5 h-5 text-green-600 dark:text-green-400" strokeWidth={2} />
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">
              اطلاعیه
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              پس از تایید ادمین، کانال شما به لیست کانال‌های فعال اضافه خواهد شد.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3 justify-center">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setCurrentStep(0);
            setSelectedPlatform(null);
            setChannelName("");
            setVerificationCode("");
            setIsCompleted(false);
          }}
          icon={MessageSquare}
        >
          اتصال کانال جدید
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["channel"] });
            navigate(getViewPath(VIEWNAME.CHANNEL_SEARCH));
          }}
          icon={List}
        >
          مشاهده لیست کانال‌ها
        </Button>
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <PageTransition>
        <Breadcrumb items={breadcrumbItems} className="mb-4" />
        <PageHeader title="اتصال کانال به ربات" />

        <CreatePageFormWrapper>
          <CompactStepper
            steps={steps}
            currentStep={currentStep}
            className="max-w-3xl mx-auto mt-3 mb-8"
          />

          <div className="max-w-3xl mx-auto bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </div>
        </CreatePageFormWrapper>
      </PageTransition>
    </PageWrapper>
  );
};

export default ChannelCreate;
