import SubSidebar from "@/components/SubSidebar";

const ProfilePage = () => {
  const submenuItems = [
    { label: "اطلاعات شخصی", href: "/profile/info" },
    { label: "امنیت", href: "/profile/security" },
    { label: "تنظیمات اعلان‌ها", href: "/profile/notifications" },
  ];

  return (
    <div className="flex">
      <SubSidebar items={submenuItems} />
      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">پروفایل</h1>
        {/* محتوای صفحه */}
      </div>
    </div>
  );
};
