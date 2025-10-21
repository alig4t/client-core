import React, { useState } from "react";
import { HelpCircle, Info, Star } from "lucide-react";

// --- ✨ Modern Tooltip Component ✨ ---

// Define the props for the Tooltip component
interface TooltipProps {
  /** The element that will trigger the tooltip */
  children: React.ReactNode;
  /** The content to display inside the tooltip (can be a string or JSX) */
  content: React.ReactNode;
  /** The position of the tooltip relative to the child element */
  position?: "top" | "bottom" | "left" | "right";
  /** Optional custom class names for the tooltip bubble */
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // --- Positioning Classes ---
  // These classes control the placement and arrow position of the tooltip
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "bottom-[-4px] left-1/2 -translate-x-1/2",
    bottom: "top-[-4px] left-1/2 -translate-x-1/2 rotate-180",
    left: "right-[-4px] top-1/2 -translate-y-1/2 -rotate-90",
    right: "left-[-4px] top-1/2 -translate-y-1/2 rotate-90",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      // Add tabIndex to make non-interactive elements focusable
      tabIndex={0}
    >
      {/* The trigger element */}
      {children}

      {/* The Tooltip Bubble (conditionally rendered) */}
      <div
        role="tooltip"
        className={`
          absolute z-10 w-max max-w-xs px-3 py-1.5 
          bg-gray-800 dark:bg-black text-white text-sm rounded-md shadow-lg
          transition-all duration-200 ease-in-out
          ${positionClasses[position]}
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          ${className}
        `}
        // Prevent the tooltip itself from triggering mouse leave on the parent
        style={{ pointerEvents: isVisible ? "auto" : "none" }}
      >
        {content}
        {/* The Tooltip Arrow */}
        <div
          className={`absolute w-2 h-2 bg-gray-800 dark:bg-black transform ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
