import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { TagModel } from '@/Models/Tag/TagModel'; // مسیر مدل خود را وارد کنید
import TagService from './TagService';
import ErrorMessage from '@/components/general/ErrorMessage';
import Spinner from '@/components/general/Spinner';


const ITEMS_PER_PAGE = 10;

const TagsTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('name-asc');

  // استفاده از useQuery برای دریافت، کش کردن و مدیریت داده‌ها
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['tags'], // کلید منحصر به فرد برای این کوئری
    queryFn: async () => {
      const response = await TagService.getAll();
      // فرض بر این است که BaseResponse شما یک پراپرتی data دارد
      return response.data.data; 
    },
    staleTime: 5 * 60 * 1000, // 5 دقیقه کش
  });

  // مرتب‌سازی و صفحه‌بندی داده‌ها در سمت کلاینت
  const processedData = useMemo(() => {
    if (!data) return [];

    const sorted = [...data].sort((a, b) => {
      const [key, order] = sortOption.split('-');
      if (key === 'name') {
        return order === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  }, [data, sortOption, currentPage]);

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <ErrorMessage 
        message={error instanceof Error ? error.message : 'یک خطای ناشناخته رخ داد'} 
        onRetry={() => refetch()} 
      />
    );
  }
  
  const totalPages = data ? Math.ceil(data.length / ITEMS_PER_PAGE) : 0;

  return (
    <div dir="rtl" className="p-6 bg-white rounded-lg border border-gray-200">
      {/* هدر جدول شامل مرتب‌سازی و کنترل‌ها */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">لیست تگ‌ها</h2>
        <div>
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 ml-2">مرتب‌سازی:</label>
          <select 
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="name-asc">نام (صعودی)</option>
            <option value="name-desc">نام (نزولی)</option>
          </select>
        </div>
      </div>

      {/* جدول داده‌ها */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام تگ</th>
              {/* ستون‌های دیگر */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processedData.map((tag: TagModel) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tag.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.name}</td>
                {/* سلول‌های دیگر */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* کنترل‌های صفحه‌بندی */}
      <div className="flex items-center justify-between mt-4">
        <button 
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="text-sm text-gray-700">
          صفحه {currentPage} از {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          بعدی
        </button>
      </div>
    </div>
  );
};

export default TagsTable;