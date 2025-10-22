import React, { useEffect, useState } from 'react';
import AdminModal from './AdminModal';
import api from '../../lib/api';
import type { Category } from '../../types/models';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Category>; // if provided -> edit
  onSaved: () => void; // refetch
};

export default function CategoryFormModal({
  open,
  onClose,
  initial,
  onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '');
      setDescription(initial?.description ?? '');
      setErr(null);
    }
  }, [open, initial?.id]);

  const toMsg = (e: any) => {
    const d = e?.response?.data;
    if (typeof d === 'string') return d;
    if (d?.message) return d.message;
    if (d?.errors) {
      const first = Object.values(d.errors)[0] as string[] | undefined;
      if (first?.length) return first[0];
    }
    return 'Request failed';
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      if (isEdit) {
        await api.put(`/categories/${initial!.id}`, { name, description });
      } else {
        await api.post(`/categories`, { name, description });
      }
      onSaved();
      onClose();
    } catch (e) {
      setErr(toMsg(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Category' : 'Create Category'}
    >
      <form onSubmit={submit} className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm text-gray-300'>Name</label>
          <input
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={255}
          />
        </div>
        <div>
          <label className='mb-1 block text-sm text-gray-300'>
            Description
          </label>
          <textarea
            className='min-h-[90px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600'
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {err && (
          <p className='rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300'>
            {err}
          </p>
        )}
        <div className='flex justify-end gap-2'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/10'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={saving}
            className='rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60'
          >
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
