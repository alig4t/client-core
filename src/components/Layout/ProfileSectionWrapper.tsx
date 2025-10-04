import React from "react";

type ProfileSectionWrapperProps = {
  title: string;
  children?: React.ReactNode;
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
    <div className="bg-[var(--card)] rounded-[15px] p-6 my-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[var(--foreground)]  text-center md:text-right">
          {title}
        </h2>
        <div>{newLink}</div>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
};

export default ProfileSectionWrapper;
