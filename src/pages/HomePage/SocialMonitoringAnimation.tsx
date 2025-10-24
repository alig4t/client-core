// src/components/SocialMonitoringAnimation.tsx

import React from "react";
import Lottie from "lottie-react";
// مسیر را با توجه به محل فایل JSON خود تنظیم کنید
// import animationData from "./Boy-Under-Social-Tree.json";
// import animationData from "./email-marketing.json";
import animationData from "./Boy-Under-Social-Tree-blue.json";

interface SocialMonitoringAnimationProps {
  width?: string;
  height?: string;
}

const SocialMonitoringAnimation: React.FC<SocialMonitoringAnimationProps> = ({
  width = "100%",
  height = "100%",
}) => {
  const defaultOptions = {
    loop: true, // آیا انیمیشن تکرار شود
    autoplay: true, // آیا انیمیشن بلافاصله شروع شود
    animationData: animationData, // داده‌های JSON انیمیشن
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // نحوه مقیاس‌بندی
    },
  };

  return (
    <div style={{ width: width, height: height }}>
      {/*
        کامپوننت Lottie داده‌های JSON را می‌گیرد و آن را در یک SVG رندر می‌کند.
        این کامپوننت به طور خودکار انیمیشن را بر اساس تنظیمات (defaultOptions) مدیریت می‌کند.
      */}
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default SocialMonitoringAnimation;
