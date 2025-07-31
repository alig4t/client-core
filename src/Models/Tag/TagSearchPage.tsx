// pages/tags/TagSearchPage.tsx
import { useEffect, useState } from 'react';
import TagService from '@/Models/Tag/TagService';
import { Link } from 'react-router-dom';
import type { TagModel } from './TagModel';

export default function TagSearchPage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<TagModel[]>([]);

  const fetchTags = async () => {
    const res = await TagService.getAll();
    const filtered = res.data.data.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
    setTags(filtered);
  };

  useEffect(() => {
    fetchTags();
  }, [search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <input
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی نام برچسب"
        />
        <Link to="/tags/create" className="btn btn-primary">افزودن جدید</Link>
      </div>
      <table className="table w-full">
        <thead>
          <tr>
            <th>شناسه</th>
            <th>نام</th>
            <th>جزئیات</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.id}</td>
              <td>{tag.name}</td>
              <td>
                <Link to={`/tags/${tag.id}`} className="link">مشاهده</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
