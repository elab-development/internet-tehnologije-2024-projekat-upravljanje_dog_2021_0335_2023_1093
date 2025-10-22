import React, { useEffect, useState } from 'react';
import AdminModal from './AdminModal';
import api from '../../lib/api';
import type { Category, EventItem } from '../../types/models';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Partial<EventItem>;
  onSaved: () => void;
};

function toLocalInputValue(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EventFormModal({
  open,
  onClose,
  initial,
  onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  const [startTime, setStartTime] = useState(
    toLocalInputValue(initial?.start_time) || ''
  );
  const [endTime, setEndTime] = useState(
    toLocalInputValue(initial?.end_time) || ''
  );
  const [categoryId, setCategoryId] = useState<number | ''>(
    initial?.category_id ?? ''
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ categories: Category[] }>(
          '/categories'
        );
        setCategories(data.categories);
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? '');
      setDescription(initial?.description ?? '');
      setLocation(initial?.location ?? '');
      setStartTime(toLocalInputValue(initial?.start_time) || '');
      setEndTime(toLocalInputValue(initial?.end_time) || '');
      setCategoryId(initial?.category_id ?? '');
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
    const payload = {
      title,
      description: description || null,
      location: location || null,
      start_time: startTime ? new Date(startTime).toISOString() : '',
      end_time: endTime ? new Date(endTime).toISOString() : null,
      category_id: categoryId === '' ? null : Number(categoryId),
    };
    try {
      if (isEdit) {
        await api.put(`/events/${initial!.id}`, payload);
      } else {
        await api.post(`/events`, payload);
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
      title={isEdit ? 'Edit Event' : 'Create Event'}
      maxWidthClass='max-w-2xl'
    >
      <form onSubmit={submit} className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-sm text-gray-300'>Title</label>
          <input
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={255}
          />
        </div>

        <div className='sm:col-span-2'>
          <label className='mb-1 block text-sm text-gray-300'>
            Description
          </label>
          <textarea
            className='min-h-[100px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-300'>Location</label>
          <input
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={location ?? ''}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-300'>Category</label>
          <select
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={categoryId === '' ? '' : Number(categoryId)}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : '')
            }
          >
            <option value=''>— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-300'>Start time</label>
          <input
            type='datetime-local'
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-300'>End time</label>
          <input
            type='datetime-local'
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        {err && (
          <p className='sm:col-span-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300'>
            {err}
          </p>
        )}

        <div className='sm:col-span-2 flex justify-end gap-2'>
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
