import { useEffect, useState } from 'react';
import api from '../../lib/api';
import type { Category } from '../../types/models';
import CategoryFormModal from './CategoryFormModal';

export default function CategoriesAdmin() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<{ categories: Category[] }>('/categories');
      setItems(data.categories);
    } catch (e: any) {
      setErr(
        typeof e?.response?.data === 'string'
          ? e.response.data
          : 'Failed to load'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const onEdit = (c: Category) => {
    setEditItem(c);
    setModalOpen(true);
  };
  const onDelete = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    await api.delete(`/categories/${c.id}`);
    fetchData();
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-white'>Categories</h2>
        <button
          onClick={onCreate}
          className='rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500'
        >
          New Category
        </button>
      </div>

      {loading && <p className='text-sm text-gray-400'>Loading…</p>}
      {err && <p className='text-sm text-red-300'>{err}</p>}

      {!loading && !err && (
        <div className='overflow-x-auto rounded-xl border border-white/10'>
          <table className='min-w-full text-left text-sm'>
            <thead className='bg-white/5 text-gray-300'>
              <tr>
                <th className='px-4 py-2'>Name</th>
                <th className='px-4 py-2'>Description</th>
                <th className='px-4 py-2'>Events</th>
                <th className='px-4 py-2 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/10'>
              {items.map((c) => (
                <tr key={c.id} className='hover:bg-white/5'>
                  <td className='px-4 py-2 text-white'>{c.name}</td>
                  <td className='px-4 py-2 text-gray-300'>
                    {c.description ?? '—'}
                  </td>
                  <td className='px-4 py-2 text-gray-300'>
                    {c.events_count ?? 0}
                  </td>
                  <td className='px-4 py-2 text-right'>
                    <button
                      onClick={() => onEdit(c)}
                      className='mr-2 rounded-lg border border-white/15 px-2 py-1 text-xs text-gray-200 hover:bg-white/10'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      className='rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className='px-4 py-4 text-gray-400' colSpan={4}>
                    No categories yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editItem ?? undefined}
        onSaved={fetchData}
      />
    </div>
  );
}
