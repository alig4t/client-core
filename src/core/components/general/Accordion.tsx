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
    <div className="border border-[var(--border)] bg-[var(--white)] dark:bg-[var(--black)] rounded-lg mb-6 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-[var(--white)] hover:bg-gray-50 dark:hover:bg-[#0b111d] transition-colors duration-300"
      >
        <div className="font-semibold text-[var(--primary-text)]">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} className="text-gray-600 dark:text-gray-400" />
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
        className="bg-[var(--white)] overflow-hidden"
        aria-hidden={!isOpen}
      >
        <div className="p-6 border-t border-[var(--border)]">{children}</div>
      </motion.section>
    </div>
  );
};

export default Accordion;
