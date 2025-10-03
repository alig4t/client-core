import React from "react";

type ProfileSectionWrapperProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  newLink?: React.ReactNode;
};

const ProfileSectionWrapper: React.FC<ProfileSectionWrapperProps> = ({
  title,
  newLink,
  children,
  className = "",
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--primary)]  text-center md:text-right">
          {title}
        </h2>
        <div>{newLink}</div>
      </div>
      <div
        dir="rtl"
        className={`bg-[var(--card)] p-6 md:p-8  rounded-sm shadow-sm w-full ${className}`}
      >
        <div>{children}</div>
      </div>
    </>
  );
};

export default ProfileSectionWrapper;
