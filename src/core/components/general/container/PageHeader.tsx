// components/PageHeader.tsx
import React from 'react';
import type { ButtonVariant } from '../button/Button';
import Button from '../button/Button';


type PageHeaderProps = {
  title: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant; // Reuse the same variant type
  };
  className?: string;
};

const PageHeader = ({ title, actionButton, className = '' }: PageHeaderProps) => {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
      {actionButton && (
        <Button
          variant={actionButton.variant || 'success'}
          onClick={actionButton.onClick}
          type="button"
        >
          {actionButton.label}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;