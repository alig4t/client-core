// pages/tags/ViewTagPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TagService from '@/Models/Tag/TagService';
import type { TagModel } from './TagModel';

export default function ViewTagPage() {
  const { id } = useParams();
  const [tag, setTag] = useState<TagModel | null>(null);

  useEffect(() => {
    if (id) {
      TagService.getById(Number(id)).then((res) => setTag(res.data.data));
    }
  }, [id]);

  if (!tag) return <p className="p-4">در حال بارگذاری...</p>;

  return (
    <div className="p-6 space-y-2">
      <h1 className="text-lg font-bold">جزئیات برچسب</h1>
      <p><strong>شناسه:</strong> {tag.id}</p>
      <p><strong>نام:</strong> {tag.name}</p>
      <p><strong>تاریخ ایجاد:</strong> {tag.createdAt}</p>
    </div>
  );
}
