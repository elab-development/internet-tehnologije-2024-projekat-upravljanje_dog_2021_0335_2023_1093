import { useEffect, useState } from 'react';
import api from '../../lib/api';
import type {
  Category,
  EventItem,
  PaginatedResponse,
} from '../../types/models';
import EventFormModal from './EventFormModal';

export default function EventsAdmin() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [_, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<EventItem | null>(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginatedResponse<EventItem>['meta'] | null>(
    null
  );

  const fetchData = async (p = 1) => {
    setLoading(true);
    setErr(null);
    try {
      const [evRes, catRes] = await Promise.all([
        api.get<PaginatedResponse<EventItem>>(`/events?per_page=10&page=${p}`),
        api.get<{ categories: Category[] }>('/categories'),
      ]);
      setItems((evRes.data.events ?? []) as EventItem[]);
      setMeta(evRes.data.meta ?? null);
      setCategories(catRes.data.categories);
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
    fetchData(page);
  }, [page]);

  const onCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const onEdit = (ev: EventItem) => {
    setEditItem(ev);
    setModalOpen(true);
  };
  const onDelete = async (ev: EventItem) => {
    if (!confirm(`Delete event "${ev.title}"?`)) return;
    await api.delete(`/events/${ev.id}`);
    fetchData(page);
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-white'>Events</h2>
        <button
          onClick={onCreate}
          className='rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500'
        >
          New Event
        </button>
      </div>

      {loading && <p className='text-sm text-gray-400'>Loading…</p>}
      {err && <p className='text-sm text-red-300'>{err}</p>}

      {!loading && !err && (
        <>
          <div className='overflow-x-auto rounded-xl border border-white/10'>
            <table className='min-w-full text-left text-sm'>
              <thead className='bg-white/5 text-gray-300'>
                <tr>
                  <th className='px-4 py-2'>Title</th>
                  <th className='px-4 py-2'>Category</th>
                  <th className='px-4 py-2'>Start</th>
                  <th className='px-4 py-2'>End</th>
                  <th className='px-4 py-2'>Tickets</th>
                  <th className='px-4 py-2 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/10'>
                {items.map((ev) => (
                  <tr key={ev.id} className='hover:bg-white/5'>
                    <td className='px-4 py-2 text-white'>{ev.title}</td>
                    <td className='px-4 py-2 text-gray-300'>
                      {ev.category?.name ?? '—'}
                    </td>
                    <td className='px-4 py-2 text-gray-300'>
                      {new Date(ev.start_time).toLocaleString()}
                    </td>
                    <td className='px-4 py-2 text-gray-300'>
                      {ev.end_time
                        ? new Date(ev.end_time).toLocaleString()
                        : '—'}
                    </td>
                    <td className='px-4 py-2 text-gray-300'>
                      {ev.tickets_count ?? 0}
                    </td>
                    <td className='px-4 py-2 text-right'>
                      <button
                        onClick={() => onEdit(ev)}
                        className='mr-2 rounded-lg border border-white/15 px-2 py-1 text-xs text-gray-200 hover:bg-white/10'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(ev)}
                        className='rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td className='px-4 py-4 text-gray-400' colSpan={6}>
                      No events yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {meta && meta.last_page > 1 && (
            <div className='mt-3 flex items-center justify-end gap-2 text-sm'>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className='rounded-lg border border-white/15 px-3 py-1 text-gray-200 hover:bg-white/10 disabled:opacity-50'
              >
                Prev
              </button>
              <span className='text-gray-400'>
                Page {meta.current_page} / {meta.last_page}
              </span>
              <button
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className='rounded-lg border border-white/15 px-3 py-1 text-gray-200 hover:bg-white/10 disabled:opacity-50'
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <EventFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editItem ?? undefined}
        onSaved={() => fetchData(page)}
      />
    </div>
  );
}
