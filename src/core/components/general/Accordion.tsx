import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg mb-6 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 bg-[var(--table-header-bg)] hover:bg-[var(--bg-tertiary)] transition-colors duration-200 border-b border-[var(--table-border)]"
      >
        <div className="text-base font-semibold text-[var(--text-primary)]">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-[var(--text-secondary)]" />
        </motion.div>
      </button>

      <motion.section
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.25, ease: "easeInOut" }
        }}
        className="bg-[var(--card-bg)] overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div className="px-6 py-5">{children}</div>
      </motion.section>
    </div>
  );
};

export default Accordion;
