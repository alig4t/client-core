// components/PageHeader.tsx
import React from 'react';
import Button from '../../../components/Button/Button';
import type{ ButtonVariant } from '../../../components/Button/Button';

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
      <h1 className="!text-2xl font-bold text-[var(--primary-text)]">{title}</h1>
      {actionButton && (
        <Button
          variant={actionButton.variant || 'success'} // But wait—'success' isn't in ButtonVariant!
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