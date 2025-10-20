// components/ButtonPanel.tsx
import React from 'react';

type ButtonPanelProps = {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end'; // default: 'end'
  className?: string;
};

const ButtonPanel = ({ children, align = 'end', className = '' }: ButtonPanelProps) => {
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  return (
    <div
      className={`flex items-center gap-2.5 mt-6 ${alignmentClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
};

export default ButtonPanel;