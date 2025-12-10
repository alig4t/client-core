import { useEffect, useRef, useState, type FC } from "react";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  dir?: "rtl" | "ltr";
  className?: string;
}

const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  align = "end",
  dir = "rtl",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Type useRef for a div element
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // In RTL, 'end' means right, 'start' means left
  const alignClass = align === "end" ? "left-0" : "right-0";

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
      dir={dir}
    >
      {/* Trigger element */}
      <div onClick={toggleOpen}>{trigger}</div>

      {/* Content */}
      <div
        className={`absolute z-50 mt-2 w-64 origin-top-right rounded-xl shadow-2xl transition-all duration-300 overflow-hidden
        ${alignClass}
        ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        }
        bg-[var(--background)] border border-gray-100 dark:border-gray-700
      `}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown
