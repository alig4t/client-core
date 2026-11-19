import { useEffect, useRef, useState, type FC } from "react";
import { useCore } from "../../entity/CoreProvider";

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
  dir,
  className = "",
}) => {
  const { direction } = useCore();
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

  // Logical alignment follows the active direction.
  const alignClass = align === "end" ? "end-0" : "start-0";

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
      dir={dir ?? direction}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          event.stopPropagation();
          setIsOpen(false);
          dropdownRef.current?.querySelector("button")?.focus();
        }
      }}
    >
      {/* Trigger element */}
      <div onClick={toggleOpen}>{trigger}</div>

      {/* Content */}
      <div
        hidden={!isOpen}
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

export default Dropdown;
