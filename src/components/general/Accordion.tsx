import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  startOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  startOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="border border-[var(--border)] bg-[var(--white)] dark:bg-[var(--black)] rounded-lg mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-[var(--white)] hover:bg-gray-50 dark:hover:bg-[#0b111d] transition-colors duration-300"
      >
        <div className="font-semibold text-[var(--primary-text)]">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-gray-600" />
        </motion.div>
      </button>

      {/* همیشه رندر شود — فقط انیمیشن visibility/height تغییر کند */}
      <motion.section
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
        }}
        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="bg-[var(--white)]"
        aria-hidden={!isOpen}
      >
        <div className="p-6 border-t border-[var(--border)]">{children}</div>
      </motion.section>
    </div>
  );
};

export default Accordion;
