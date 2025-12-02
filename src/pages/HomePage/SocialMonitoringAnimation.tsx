// src/components/SocialMonitoringAnimation.tsx

import React from "react";
import Lottie from "lottie-react";
// Set path according to your JSON file location
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
    loop: true, // Should animation loop
    autoplay: true, // Should animation start immediately
    animationData: animationData, // Animation JSON data
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice", // Scaling mode
    },
  };

  return (
    <div style={{ width: width, height: height }}>
      {/*
        Lottie component takes JSON data and renders it as an SVG.
        This component automatically manages animation based on settings (defaultOptions).
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
