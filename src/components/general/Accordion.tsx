import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// تعریف پراپ‌های کامپوننت آکاردئون
interface AccordionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  startOpen?: boolean; // پراپ اختیاری برای باز بودن اولیه
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  startOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(startOpen);

  return (
    <div className="border border-[var(--border)] bg-[var(--white)] dark:bg-[var(--black)] rounded-lg mb-6">
      {/* هدر آکاردئون که با کلیک باز و بسته می‌شود */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-[var(--white)] hover:bg-gray-50 dark:hover:bg-[#0b111d] transition-colors duration-300"
      >
        <div className="font-semibold text-[var(--primary-text)]">{title}</div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }} // انیمیشن چرخش آیکون
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} className="text-gray-600" />
        </motion.div>
      </button>

      {/* محتوای آکاردئون که با انیمیشن نمایش داده می‌شود */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="bg-[var(--white)]"
          >
            <div className="p-6 border-t border-[var(--border)] mb-1.5">{children}</div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Accordion;
