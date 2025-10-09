import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner: React.FC<{ size?: number,className?:string }> = ({ size = 48,className }) => {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 size={size} className={`animate-spin text-purple-600 ${className}`} />
    </div>
  );
};

export default Spinner;