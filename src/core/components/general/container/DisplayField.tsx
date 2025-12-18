// src/components/display/DisplayField.tsx

import type { FC } from "react";
import type { LinkProps } from "react-router-dom";
import { Link } from "react-router-dom";

// import { Link, LinkProps } from "@/components/general/Link"; // Assuming the path for Link

interface DisplayFieldProps {
  label: string;
  value: React.ReactNode;
  /** Optional link configuration if the value is a reference to another model. */
  link?: Omit<LinkProps, "children">;
  /** Optional: Specify column span for this field. */
  colSpan?: number | "full";
}

/**
 * Renders a single label-value pair, with optional support for linking to a related record.
 */
export const DisplayField: FC<DisplayFieldProps> = ({
  label,
  value,
  link,
  colSpan,
}) => {
  const colSpanClass =
    colSpan === "full"
      ? "sm:col-span-full"
      : colSpan
        ? `sm:col-span-${colSpan}`
        : "sm:col-span-1";

  // Check for empty/null values and display a placeholder
  const isValueEmpty = value === null || value === undefined || value === "";
  const displayValue = isValueEmpty ? (
    <span className="text-[var(--text-tertiary)] italic">— نامشخص —</span>
  ) : (
    value
  );

  return (
    <div
      className={`flex flex-col gap-1.5 p-4 bg-[var(--bg-tertiary)] rounded-lg ${colSpanClass}`}
    >
      {/* Label/Title */}
      <dt className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">{label}</dt>

      {/* Value */}
      <dd className="text-sm font-medium text-[var(--text-primary)] break-words">
        {link && !isValueEmpty ? (
          // Render as a Link if link props are provided and value is not empty
          <Link
            className=""
            to={link.to}
            //   view={link.view}
            id={link.id}
          >
            {displayValue}
          </Link>
        ) : (
          // Render as plain text
          displayValue
        )}
      </dd>
    </div>
  );
};
