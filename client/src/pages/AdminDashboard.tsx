import { useState } from 'react';
import CategoriesAdmin from '../components/admin/CategoriesAdmin';
import EventsAdmin from '../components/admin/EventsAdmin';
import TicketsAdmin from '../components/admin/TicketsAdmin';

type TabKey = 'categories' | 'events' | 'tickets';
const tabs: { key: TabKey; label: string }[] = [
  { key: 'categories', label: 'Categories' },
  { key: 'events', label: 'Events' },
  { key: 'tickets', label: 'Tickets' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState<TabKey>('categories');

  return (
    <div className='pb-12'>
      <section className='relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black to-[#0b0b0d] px-6 py-10 sm:px-10 sm:py-12 lg:px-16'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-red-600/20 blur-3xl' />
          <div className='absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-red-600/10 blur-3xl' />
        </div>

        <header className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
              Admin Dashboard
            </h1>
            <p className='mt-1 text-sm text-gray-300'>
              Manage categories, events, and tickets.
            </p>
          </div>
        </header>

        <div className='mt-8'>
          <div className='flex flex-wrap gap-2'>
            {tabs.map((t) => {
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={
                    isActive
                      ? 'rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30'
                      : 'rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-gray-200 transition hover:bg-red-600/20 hover:text-white'
                  }
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className='mt-6 rounded-2xl border border-white/10 bg-black/40 p-5'>
            {active === 'categories' && <CategoriesAdmin />}
            {active === 'events' && <EventsAdmin />}
            {active === 'tickets' && <TicketsAdmin />}
          </div>
        </div>
      </section>
    </div>
  );
}
