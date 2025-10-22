import { useEffect, useState } from 'react';
import api from '../../lib/api';
import type { Ticket } from '../../types/models';
import TicketFormModal from './TicketFormModal';

export default function TicketsAdmin() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Ticket | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<{ tickets: Ticket[] }>('/tickets');
      setItems(data.tickets);
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

  const onDelete = async (t: Ticket) => {
    if (!confirm(`Delete ticket #${t.id}?`)) return;
    await api.delete(`/tickets/${t.id}`);
    fetchData();
  };

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-white'>Tickets</h2>
        <button
          onClick={() => setCreateOpen(true)}
          className='rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500'
        >
          Create Ticket
        </button>
      </div>

      {loading && <p className='text-sm text-gray-400'>Loading…</p>}
      {err && <p className='text-sm text-red-300'>{err}</p>}

      {!loading && !err && (
        <div className='overflow-x-auto rounded-xl border border-white/10'>
          <table className='min-w-full text-left text-sm'>
            <thead className='bg-white/5 text-gray-300'>
              <tr>
                <th className='px-4 py-2'>ID</th>
                <th className='px-4 py-2'>Event</th>
                <th className='px-4 py-2'>User</th>
                <th className='px-4 py-2'>Status</th>
                <th className='px-4 py-2'>Price</th>
                <th className='px-4 py-2'>Created</th>
                <th className='px-4 py-2 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/10'>
              {items.map((t) => (
                <tr key={t.id} className='hover:bg-white/5'>
                  <td className='px-4 py-2 text-white'>#{t.id}</td>
                  <td className='px-4 py-2 text-gray-300'>
                    {t.event?.title ?? t.event_id}
                  </td>
                  <td className='px-4 py-2 text-gray-300'>
                    {t.user?.name ?? `User ${t.user_id}`}
                  </td>
                  <td className='px-4 py-2'>
                    <span className='rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-200'>
                      {t.status}
                    </span>
                  </td>
                  <td className='px-4 py-2 text-gray-300'>
                    {t.price != null ? t.price.toFixed(2) : '—'}
                  </td>
                  <td className='px-4 py-2 text-gray-300'>
                    {t.created_at
                      ? new Date(t.created_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className='px-4 py-2 text-right'>
                    <button
                      onClick={() => setEditItem(t)}
                      className='mr-2 rounded-lg border border-white/15 px-2 py-1 text-xs text-gray-200 hover:bg-white/10'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(t)}
                      className='rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className='px-4 py-4 text-gray-400' colSpan={7}>
                    No tickets yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <TicketFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={fetchData}
      />

      <TicketFormModal
        open={!!editItem}
        onClose={() => setEditItem(null)}
        initial={editItem ?? undefined}
        onSaved={fetchData}
      />
    </div>
  );
}
