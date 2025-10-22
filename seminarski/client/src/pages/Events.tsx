import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api';
import EventCard from '../components/EventCard';
import type { Category, EventItem, PaginatedResponse } from '../types/models';
import { Link, useSearchParams } from 'react-router-dom';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<EventItem[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<EventItem>['meta'] | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Query params (sync sa URL-om)
  const page = Number(searchParams.get('page') || 1);
  const perPage = Number(searchParams.get('per_page') || 12);
  const categoryId = searchParams.get('category_id');
  const qParam = searchParams.get('q') || '';

  // Local search state (vezan za query param)
  const [q, setQ] = useState(qParam);

  // Fetch categories (once)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{ categories: Category[] }>(
          '/categories'
        );
        setCategories(data.categories);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Fetch events on page/category/perPage change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErr(null);
      try {
        const url = new URL(
          '/events',
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        );
        url.searchParams.set('per_page', String(perPage));
        url.searchParams.set('page', String(page));
        if (categoryId) url.searchParams.set('category_id', categoryId);

        const { data } = await api.get<PaginatedResponse<EventItem>>(
          url.pathname + url.search
        );
        setItems((data.events ?? []) as EventItem[]);
        setMeta(data.meta ?? null);
      } catch (e: any) {
        setErr(
          typeof e?.response?.data === 'string'
            ? e.response.data
            : 'Failed to load events'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, categoryId]);

  // Client-side search over current page
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return items;
    return items.filter((ev) => {
      const title = ev.title?.toLowerCase() ?? '';
      const loc = ev.location?.toLowerCase() ?? '';
      const cat = ev.category?.name?.toLowerCase() ?? '';
      return title.includes(t) || loc.includes(t) || cat.includes(t);
    });
  }, [items, q]);

  // Handleri
  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    // Reset page kad menjamo filter ili per_page
    if (key === 'category_id' || key === 'per_page') {
      next.delete('page');
    }
    setSearchParams(next, { replace: true });
  };

  const onPerPageChange = (v: number) => updateParam('per_page', String(v));
  const onCategoryChange = (v: string) => updateParam('category_id', v || null);
  const goToPage = (p: number) => updateParam('page', String(p));
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Upis u URL (nije obavezno za client-side, ali lepo je za deljenje linka)
    updateParam('q', q ? q : null);
  };

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
              Browse Events
            </h1>
            <p className='mt-1 text-sm text-gray-300'>
              Search, filter and find your next show.
            </p>
          </div>
          <Link
            to='/'
            className='hidden rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 sm:inline-block'
          >
            Back to home
          </Link>
        </header>

        {/* Filters */}
        <div className='mt-6 grid gap-3 sm:grid-cols-3'>
          <form onSubmit={onSearchSubmit} className='sm:col-span-2'>
            <label className='sr-only'>Search</label>
            <div className='flex rounded-xl border border-white/10 bg-black/40 p-1'>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder='Search by title, category, or location…'
                className='w-full rounded-l-xl bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500'
              />
              <button
                type='submit'
                className='rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
              >
                Search
              </button>
            </div>
          </form>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-2'>
            <div>
              <label className='mb-1 block text-xs text-gray-400'>
                Category
              </label>
              <select
                value={categoryId ?? ''}
                onChange={(e) => onCategoryChange(e.target.value)}
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
              >
                <option value=''>All</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='mb-1 block text-xs text-gray-400'>
                Per page
              </label>
              <select
                value={perPage}
                onChange={(e) => onPerPageChange(Number(e.target.value))}
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-red-600'
              >
                {[6, 12, 24, 48].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status / counts */}
        <div className='mt-4 text-sm text-gray-400'>
          {loading && <span>Loading events…</span>}
          {!loading && err && <span className='text-red-300'>{err}</span>}
          {!loading && !err && meta && (
            <span>
              Showing <span className='text-white'>{filtered.length}</span> of{' '}
              <span className='text-white'>{meta.per_page}</span> on this page •
              Total: <span className='text-white'>{meta.total}</span>
            </span>
          )}
        </div>

        {/* Grid */}
        <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {!loading &&
            !err &&
            filtered.map((ev) => <EventCard key={ev.id} event={ev} />)}
        </div>

        {/* Pagination */}
        {!loading && !err && meta && meta.last_page > 1 && (
          <div className='mt-8 flex items-center justify-center gap-2'>
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className='rounded-xl border border-white/15 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-50'
            >
              Prev
            </button>
            <span className='text-sm text-gray-400'>
              Page <span className='text-white'>{meta.current_page}</span> /{' '}
              <span className='text-white'>{meta.last_page}</span>
            </span>
            <button
              onClick={() => goToPage(Math.min(meta.last_page!, page + 1))}
              disabled={page >= (meta.last_page || 1)}
              className='rounded-xl border border-white/15 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 disabled:opacity-50'
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
