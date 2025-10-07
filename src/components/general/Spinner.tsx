import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 size={size} className="animate-spin text-purple-600" />
    </div>
  );
};

export default Spinner;