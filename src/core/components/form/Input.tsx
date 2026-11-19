import { Search } from "lucide-react";
import { Input as CoreInput } from "../../ui/Input";
import type { InputProps } from "../../ui/types";
import { cn } from "../../utils/classNames";

/** Legacy search input. New plain inputs use the independent core/ui entry. */
export default function Input({ className, ...props }: InputProps) {
  return (
    <div className="relative w-full">
      <CoreInput {...props} className={cn("pe-10", className)} />
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 end-3 -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
}
