import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void; // تابع برای تلاش مجدد
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="text-center py-16 bg-red-50 border border-red-100 rounded-lg">
      <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-2 text-sm font-semibold text-red-800">خطا در دریافت اطلاعات</h3>
      <p className="mt-1 text-sm text-red-700">{message}</p>
      <div className="mt-4">
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;