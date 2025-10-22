import { Link } from 'react-router-dom';
import type { EventItem } from '../types/models';

type Props = {
  event: EventItem;
};

function formatDate(dt: string | undefined | null) {
  if (!dt) return '—';
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export default function EventCard({ event }: Props) {
  return (
    <div className='flex flex-col rounded-2xl border border-white/10 bg-black/40 p-4 shadow-sm hover:shadow-md hover:shadow-red-600/10 transition'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h3 className='text-lg font-semibold text-white'>{event.title}</h3>
          <p className='mt-1 text-sm text-gray-300 line-clamp-2'>
            {event.description ?? 'No description.'}
          </p>
        </div>
        <span className='shrink-0 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-gray-200'>
          {event.category?.name ?? 'Uncategorized'}
        </span>
      </div>

      <div className='mt-4 grid gap-2 text-sm text-gray-300'>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>Location</span>
          <span className='text-white'>{event.location ?? '—'}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>Starts</span>
          <span className='text-white'>{formatDate(event.start_time)}</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>Ends</span>
          <span className='text-white'>
            {formatDate(event.end_time ?? undefined)}
          </span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-gray-400'>Tickets</span>
          <span className='text-white'>{event.tickets_count ?? 0}</span>
        </div>
      </div>

      <div className='mt-4 flex justify-end'>
        <Link
          to={`/events/${event.id}`}
          className='inline-flex items-center rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
        >
          View details
        </Link>
      </div>
    </div>
  );
}
