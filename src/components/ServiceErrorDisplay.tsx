import Button from "@/core/components/general/Button";
import { FolderSearch } from "lucide-react";

export default function ServiceErrorDisplay({
  refetch,
}: {
  refetch: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4 rtl">
      <div className="bg-gray-200 rounded-full p-6 mb-6">
        <FolderSearch className="w-12 h-12 text-gray-600" />
      </div>
      <h2 className="text-xl font-bold text-[var(--primary-text)] dark:text-zinc-200 dark mb-2">
        خطایی در ارتباط با سرویس رخ داده است
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm">
        لطفا دوباره تلاش کنید
      </p>

      <Button
        type="button"
        className="!bg-[#c5226c] hover:!bg-[#c11764] p-2 !font-bold  shadow-md rounded-md transition hover:!text-zinc-100 !text-xs !text-white"
        onClick={() => refetch()}
      >
        تلاش مجدد
      </Button>
    </div>
  );
}
