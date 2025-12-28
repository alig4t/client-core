import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useBreadcrumbs } from "@/hooks/useBreadcrumbs";
import { MessageSquare, Info, Shield, Copy, AlertTriangle, CheckCircle2, Check, List, MessageCircleMore } from "lucide-react";
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-lg font-semibold mb-2">پلتفرم خود را انتخاب کنید</h3>
        <p className="text-sm text-gray-600">
          ابتدا کانال یا گروه خود را در پلتفرم مورد نظر ایجاد کنید
        </p>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">انتخاب پلتفرم</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {loadingPlatforms ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              در حال بارگذاری پلتفرم‌ها...
            </div>
          ) : (
            platforms?.data?.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedPlatform?.id === platform.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <MessageCircleMore className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium text-sm">{platform.platformName}</div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Channel Name Input */}
      <div>
        <label className="block text-sm font-medium mb-2">نام کانال</label>
        <input
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          placeholder="نام کانال یا گروه خود را وارد کنید"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={100}
        />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">دستورالعمل مهم:</p>
            <p className="text-sm text-gray-700">
              ابتدا کانال یا گروه جدید خود را در پلتفرم انتخابی ایجاد کنید. سپس ربات <strong>rnt_social_test_bot@</strong> را به آن اضافه کرده و دسترسی ادمین به آن بدهید.
            </p>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end gap-3 pt-4">
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-32 h-32 mx-auto mb-3">
          <Lottie
            animationData={chatBotAnimation}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <h3 className="text-lg font-semibold mb-2">کد امنیتی شما آماده است</h3>
        <p className="text-sm text-gray-600">
          این کد را در کانال خود ارسال کنید
        </p>
      </div>

      {/* Verification Code Display */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
        <div className="text-center mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">کد تایید</label>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <code className="text-2xl font-mono font-bold text-blue-600 tracking-wider select-all">
              {verificationCode}
            </code>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleCopyCode}
          className="w-full flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          کپی کد
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">مراحل بعدی:</p>
            <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
              <li>کد بالا را کپی کنید</li>
              <li>به کانال یا گروه خود بروید</li>
              <li>کد را در آن ارسال کنید</li>
              <li>سپس دکمه "کد را ارسال کردم" را کلیک کنید</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-3 pt-4">
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
    <div className="space-y-6 text-center py-8">
      <div className="w-64 h-64 mx-auto mb-4">
        <Lottie
          animationData={chatBotAnimation}
          loop={true}
          autoplay={true}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <h3 className="text-xl font-bold text-green-600">کانال با موفقیت ثبت شد!</h3>
      <p className="text-gray-600">
        کانال شما در انتظار تایید ادمین است
      </p>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm text-gray-700">
          پس از تایید ادمین، می‌توانید از کانال خود استفاده کنید
        </p>
      </div>
      <div className="pt-4">
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
            className="max-w-2xl mx-auto mt-3 mb-8"
          />

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
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
