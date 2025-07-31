// pages/tags/CreateTagPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TagService from '@/Models/Tag/TagService';

export default function CreateTagPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await TagService.create({ name });
    navigate('/tags');
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md space-y-4">
      <h1 className="text-lg font-bold">ایجاد برچسب جدید</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="نام"
        className="input input-bordered w-full"
      />
      <button type="submit" className="btn btn-primary">ایجاد</button>
    </form>
  );
}
