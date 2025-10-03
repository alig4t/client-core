import { FolderSearch } from "lucide-react";

import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen px-4 rtl">
      <div className="bg-gray-200 rounded-full p-6 mb-6">
        <FolderSearch className="w-12 h-12 text-gray-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200 dark mb-2">
        صفحه مورد نظر یافت نشد
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm">
        برای جابجایی بین صفحات مختلف از منوی کناری استفاده کنید
      </p>
      <Link
        to={"/"}
        className="!bg-[#c5226c] hover:!bg-[#c11764] p-2 !font-bold  shadow-md rounded-md transition hover:!text-zinc-100 !text-xs !text-white"
      >
        صفحه اصلی سایت
      </Link>
    </div>
  );
}
