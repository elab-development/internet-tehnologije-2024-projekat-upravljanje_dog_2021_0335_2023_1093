import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import type { Ticket } from '../types/models';
import { downloadTicketQrPng } from '../lib/qr';

export default function Account() {
  const { user, role, logout, loading: authLoading } = useAuth();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data } = await api.get<{ tickets: Ticket[] }>('/tickets');
        setTickets(data.tickets ?? []);
      } catch (e: any) {
        const d = e?.response?.data;
        const msg =
          typeof d === 'string' ? d : d?.message || 'Failed to load tickets';
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pending = useMemo(
    () => tickets.filter((t) => t.status === 'pending'),
    [tickets]
  );
  const confirmed = useMemo(
    () => tickets.filter((t) => t.status === 'confirmed'),
    [tickets]
  );
  const cancelled = useMemo(
    () => tickets.filter((t) => t.status === 'cancelled'),
    [tickets]
  );

  const fmt = (dt?: string | null) =>
    dt ? new Date(dt).toLocaleString() : '—';

  const onDownloadQr = async (t: Ticket) => {
    try {
      setDownloading((s) => ({ ...s, [t.id!]: true }));
      await downloadTicketQrPng(t, user, 512);
    } catch (e) {
      console.error(e);
      alert('Failed to generate QR code.');
    } finally {
      setDownloading((s) => ({ ...s, [t.id!]: false }));
    }
  };

  return (
    <div className='pb-12'>
      <section className='rounded-2xl border border-white/10 bg-black/40 px-6 py-8 sm:px-10'>
        <h1 className='text-2xl font-semibold text-white'>Account</h1>
        <p className='mt-1 text-sm text-gray-400'>
          Manage your profile & session.
        </p>

        <div className='mt-6 grid gap-4 sm:grid-cols-3'>
          <div className='rounded-xl border border-white/10 bg-black/30 p-4'>
            <h2 className='text-sm text-gray-400'>Name</h2>
            <p className='font-medium text-white'>{user?.name}</p>
          </div>
          <div className='rounded-xl border border-white/10 bg-black/30 p-4'>
            <h2 className='text-sm text-gray-400'>Email</h2>
            <p className='font-medium text-white'>{user?.email}</p>
          </div>
          <div className='rounded-xl border border-white/10 bg-black/30 p-4'>
            <h2 className='text-sm text-gray-400'>Role</h2>
            <p className='font-medium capitalize text-white'>{role}</p>
          </div>
        </div>

        <div className='mt-8'>
          <button
            onClick={logout}
            disabled={authLoading}
            className='rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60'
          >
            Sign out
          </button>
        </div>
      </section>

      {/* Tickets */}
      <section className='mt-8 rounded-2xl border border-white/10 bg-black/40 px-6 py-8 sm:px-10'>
        <h2 className='text-xl font-semibold text-white'>Your tickets</h2>
        <p className='mt-1 text-sm text-gray-400'>
          Pending requests and active tickets.
        </p>

        {loading && (
          <p className='mt-4 text-sm text-gray-400'>Loading tickets…</p>
        )}
        {err && <p className='mt-4 text-sm text-red-300'>{err}</p>}

        {!loading && !err && (
          <div className='mt-4 grid gap-6 lg:grid-cols-3'>
            {/* Pending */}
            <div className='rounded-2xl border border-white/10 bg-black/30 p-4'>
              <h3 className='text-base font-semibold text-white'>Pending</h3>
              <ul className='mt-3 space-y-2 text-sm'>
                {pending.length === 0 && (
                  <li className='text-gray-400'>No pending tickets.</li>
                )}
                {pending.map((t) => (
                  <li
                    key={t.id}
                    className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-200'
                  >
                    <div className='flex items-center justify-between'>
                      <span>
                        #{t.id} — {t.event?.title ?? `Event ${t.event_id}`}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {fmt(t.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirmed */}
            <div className='rounded-2xl border border-white/10 bg-black/30 p-4'>
              <h3 className='text-base font-semibold text-white'>Confirmed</h3>
              <ul className='mt-3 space-y-2 text-sm'>
                {confirmed.length === 0 && (
                  <li className='text-gray-400'>No confirmed tickets.</li>
                )}
                {confirmed.map((t) => (
                  <li
                    key={t.id}
                    className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-200'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <div className='min-w-0'>
                        <span>
                          #{t.id} — {t.event?.title ?? `Event ${t.event_id}`}
                          {t.price != null ? ` • ${t.price.toFixed(2)}` : ''}
                        </span>
                        <span className='ml-2 text-xs text-gray-400'>
                          {fmt(t.created_at)}
                        </span>
                      </div>
                      <button
                        onClick={() => onDownloadQr(t)}
                        disabled={!!downloading[t.id!]}
                        className='shrink-0 rounded-lg bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-60'
                        title='Download QR'
                      >
                        {downloading[t.id!] ? 'Generating…' : 'Download QR'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cancelled (optional) */}
            <div className='rounded-2xl border border-white/10 bg-black/30 p-4'>
              <h3 className='text-base font-semibold text-white'>Cancelled</h3>
              <ul className='mt-3 space-y-2 text-sm'>
                {cancelled.length === 0 && (
                  <li className='text-gray-400'>No cancelled tickets.</li>
                )}
                {cancelled.map((t) => (
                  <li
                    key={t.id}
                    className='rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-gray-200'
                  >
                    <div className='flex items-center justify-between'>
                      <span>
                        #{t.id} — {t.event?.title ?? `Event ${t.event_id}`}
                      </span>
                      <span className='text-xs text-gray-400'>
                        {fmt(t.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
