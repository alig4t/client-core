import React from 'react';

interface CreateFromWrapperProps {
  children: React.ReactNode;
}

const CreatePageFormWrapper: React.FC<CreateFromWrapperProps> = ({ children }) => {
  return (
    <div className="bg-[var(--white)] p-6 rounded-lg border border-[var(--card-border)] shadow-md max-w-6xl mx-auto">
      {children}
    </div>
  );
};

export default CreatePageFormWrapper;