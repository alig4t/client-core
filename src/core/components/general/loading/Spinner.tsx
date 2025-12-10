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


// // components/Spinner.tsx
// const Spinner = ({ className }: { className?: string }) => (
//   <svg
//     className={`animate-spin ${className}`}
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-25"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     ></circle>
//     <path
//       className="opacity-75"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//     ></path>
//   </svg>
// );

// export default Spinner;