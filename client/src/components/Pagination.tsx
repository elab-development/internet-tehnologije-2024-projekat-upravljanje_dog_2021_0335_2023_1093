import React from 'react';

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (next: number) => void;
  className?: string;
};

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  const makeBtn = (p: number, label?: React.ReactNode, isActive?: boolean) => (
    <button
      key={`p-${label ?? p}`}
      onClick={() => onPageChange(p)}
      disabled={p === page || p < 1 || p > totalPages}
      className={[
        'inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-sm transition',
        isActive
          ? 'border-red-600 bg-red-600 text-white'
          : 'border-white/10 bg-white/5 text-gray-200 hover:bg-red-600/20 hover:text-white disabled:opacity-60',
      ].join(' ')}
      aria-current={isActive ? 'page' : undefined}
      aria-label={typeof label === 'string' ? label : `Page ${p}`}
    >
      {label ?? p}
    </button>
  );

  const nums: (number | string)[] = [];
  const push = (v: number | string) => nums.push(v);

  const window = 1;
  const pages = new Set<number>([
    1,
    totalPages,
    page - window,
    page,
    page + window,
  ]);
  const list = Array.from(pages)
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  for (let i = 0; i < list.length; i++) {
    const cur = list[i];
    const prev = list[i - 1];
    if (i && prev !== undefined && cur - prev > 1) push('…');
    push(cur);
  }

  return (
    <div
      className={
        'mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row ' +
        (className ?? '')
      }
    >
      <div className='text-xs text-gray-400'>
        Showing <span className='text-gray-200'>{start}</span>–
        <span className='text-gray-200'>{end}</span> of{' '}
        <span className='text-gray-200'>{total}</span>
      </div>

      <nav className='flex items-center gap-2' aria-label='Pagination'>
        {makeBtn(page - 1, 'Prev')}
        {nums.map((n, i) =>
          typeof n === 'number' ? (
            makeBtn(n, undefined, n === page)
          ) : (
            <span key={`dots-${i}`} className='px-2 text-sm text-gray-500'>
              {n}
            </span>
          )
        )}
        {makeBtn(page + 1, 'Next')}
      </nav>
    </div>
  );
}
