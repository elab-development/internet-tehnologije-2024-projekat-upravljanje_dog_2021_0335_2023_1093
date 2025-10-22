import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import type { EventItem, Ticket } from '../types/models';
import { useAuth } from '../context/AuthContext';

type ApiShowEvent = { event: EventItem };

function formatDate(dt?: string | null) {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return String(dt);
  }
}

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // samo radi provere da li već postoji karta (da disable-ujemo dugme)
  const [myTicketsForEvent, setMyTicketsForEvent] = useState<Ticket[]>([]);
  const [checkingTicket, setCheckingTicket] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const eid = Number(id);

  const fetchEvent = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get<ApiShowEvent>(`/events/${id}`);
      setEvent(data.event);
    } catch (e: any) {
      const msg =
        typeof e?.response?.data === 'string'
          ? e.response.data
          : e?.response?.data?.message || 'Failed to load event';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const checkHasTicket = async () => {
    if (!isAuthenticated || !eid) {
      setMyTicketsForEvent([]);
      return;
    }
    setCheckingTicket(true);
    try {
      const { data } = await api.get<{ tickets: Ticket[] }>(
        `/tickets?event_id=${eid}`
      );
      setMyTicketsForEvent(data.tickets ?? []);
    } catch {
      // ignore – ne moramo da prikazujemo grešku jer je ovo samo za disable dugmeta
    } finally {
      setCheckingTicket(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    checkHasTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const hasAnyTicket = useMemo(
    () =>
      myTicketsForEvent.some(
        (t) => t.status === 'pending' || t.status === 'confirmed'
      ),
    [myTicketsForEvent]
  );

  const requestTicket = async () => {
    if (!eid) return;
    setRequesting(true);
    try {
      await api.post('/tickets', { event_id: eid });
      await checkHasTicket();
    } catch (e: any) {
      const d = e?.response?.data;
      const msg =
        typeof d === 'string'
          ? d
          : d?.message || d?.errors?.event_id?.[0] || 'Failed to create ticket';
      alert(msg);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className='pb-12'>
      <section className='relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black to-[#0b0b0d] px-6 py-10 sm:px-10 sm:py-12 lg:px-16'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-red-600/20 blur-3xl' />
          <div className='absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-red-600/10 blur-3xl' />
        </div>

        <header className='flex items-start justify-between gap-3'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              {loading ? 'Loading…' : event?.title ?? 'Event'}
            </h1>
            <p className='mt-1 text-sm text-gray-300'>
              {loading ? '' : event?.category?.name ?? 'Uncategorized'}
            </p>
          </div>
          <Link
            to='/events'
            className='rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/10'
          >
            Back to events
          </Link>
        </header>

        {loading && (
          <div className='mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm text-gray-300'>
            Loading event details…
          </div>
        )}
        {!loading && err && (
          <div className='mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200'>
            {err}
          </div>
        )}

        {!loading && !err && event && (
          <div className='mt-6 grid gap-5 lg:grid-cols-3'>
            {/* Left: main info */}
            <div className='lg:col-span-2 rounded-2xl border border-white/10 bg-black/40 p-5'>
              <h2 className='text-xl font-semibold text-white'>About</h2>
              <p className='mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-300'>
                {event.description || 'No description provided.'}
              </p>
            </div>

            {/* Right: meta + CTA */}
            <aside className='rounded-2xl border border-white/10 bg-black/40 p-5'>
              <h3 className='text-base font-semibold text-white'>
                Event details
              </h3>
              <dl className='mt-3 space-y-2 text-sm'>
                <div className='flex items-center justify-between gap-4'>
                  <dt className='text-gray-400'>Category</dt>
                  <dd className='text-white'>{event.category?.name ?? '—'}</dd>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <dt className='text-gray-400'>Location</dt>
                  <dd className='text-white'>{event.location ?? '—'}</dd>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <dt className='text-gray-400'>Starts</dt>
                  <dd className='text-white'>{formatDate(event.start_time)}</dd>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <dt className='text-gray-400'>Ends</dt>
                  <dd className='text-white'>{formatDate(event.end_time)}</dd>
                </div>
                <div className='flex items-center justify-between gap-4'>
                  <dt className='text-gray-400'>Tickets</dt>
                  <dd className='text-white'>{event.tickets_count ?? 0}</dd>
                </div>
              </dl>

              {isAuthenticated ? (
                <div className='mt-5'>
                  <button
                    onClick={requestTicket}
                    disabled={requesting || checkingTicket || hasAnyTicket}
                    className='w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60'
                  >
                    {hasAnyTicket
                      ? 'You already requested/own a ticket'
                      : requesting
                      ? 'Requesting…'
                      : 'Request ticket'}
                  </button>
                  {hasAnyTicket && (
                    <p className='mt-2 text-xs text-gray-400'>
                      You can have only one ticket per event.
                    </p>
                  )}
                </div>
              ) : (
                <p className='mt-5 text-sm text-gray-300'>
                  Please{' '}
                  <Link to='/login' className='text-red-400 hover:text-red-300'>
                    sign in
                  </Link>{' '}
                  to request a ticket.
                </p>
              )}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
