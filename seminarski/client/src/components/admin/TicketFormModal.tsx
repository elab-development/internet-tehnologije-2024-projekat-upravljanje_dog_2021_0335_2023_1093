import React, { useEffect, useState } from 'react';
import AdminModal from './AdminModal';
import api from '../../lib/api';
import type { EventItem, Ticket, TicketStatus } from '../../types/models';

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Ticket>; // if id present => edit (admin)
  onSaved: () => void;
};

export default function TicketFormModal({
  open,
  onClose,
  initial,
  onSaved,
}: Props) {
  const isEdit = Boolean(initial?.id);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventId, setEventId] = useState<number | ''>(initial?.event_id ?? '');
  const [userId, setUserId] = useState<number | ''>(initial?.user_id ?? '');
  const [status, setStatus] = useState<TicketStatus>(
    initial?.status ?? 'pending'
  );
  const [price, setPrice] = useState<string>(
    initial?.price != null ? String(initial.price) : ''
  );
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ events: EventItem[] }>(
          '/events?per_page=50'
        );
        setEvents(data.events || []);
      } catch (_) {}
    })();
  }, []);

  useEffect(() => {
    if (open) {
      setEventId(initial?.event_id ?? '');
      setUserId(initial?.user_id ?? '');
      setStatus((initial?.status as TicketStatus) ?? 'pending');
      setPrice(initial?.price != null ? String(initial.price) : '');
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
        await api.put(`/tickets/${initial!.id}`, {
          status,
          price: price === '' ? null : Number(price),
        });
      } else {
        await api.post(`/tickets`, {
          event_id: eventId === '' ? null : Number(eventId),
          user_id: userId === '' ? null : Number(userId),
          status,
          price: price === '' ? null : Number(price),
        });
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
      title={isEdit ? 'Edit Ticket' : 'Create Ticket'}
    >
      <form onSubmit={submit} className='space-y-4'>
        {!isEdit && (
          <>
            <div>
              <label className='mb-1 block text-sm text-gray-300'>Event</label>
              <select
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
                value={eventId === '' ? '' : Number(eventId)}
                onChange={(e) =>
                  setEventId(e.target.value ? Number(e.target.value) : '')
                }
                required
              >
                <option value=''>Select event…</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='mb-1 block text-sm text-gray-300'>
                User ID
              </label>
              <input
                type='number'
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
                value={userId === '' ? '' : Number(userId)}
                onChange={(e) =>
                  setUserId(e.target.value ? Number(e.target.value) : '')
                }
                placeholder='e.g. 5'
                required
                min={1}
              />
            </div>
          </>
        )}

        <div>
          <label className='mb-1 block text-sm text-gray-300'>Status</label>
          <select
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
          >
            <option value='pending'>pending</option>
            <option value='confirmed'>confirmed</option>
            <option value='cancelled'>cancelled</option>
          </select>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-300'>
            Price (optional)
          </label>
          <input
            type='number'
            step='0.01'
            className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
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
