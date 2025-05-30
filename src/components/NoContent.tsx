import { type LucideIcon } from "lucide-react";
import { Button } from "./ui/button";

interface NoContentProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export default function NoContent({
  icon: Icon,
  title,
  description,
  buttonText,
  onButtonClick,
}: NoContentProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full px-4 rtl">
      <div className="bg-gray-200 rounded-full p-6 mb-6">
        <Icon className="w-12 h-12 text-gray-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200 dark mb-2">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-sm">
        {description}
      </p>
      <Button
        onClick={onButtonClick}
        className="!bg-[#3271e7] hover:!bg-[#1d63e7] hover:!text-zinc-100 !text-sm text-white"
      >
        {buttonText}
      </Button>
    </div>
  );
}
