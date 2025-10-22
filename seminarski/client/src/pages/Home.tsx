import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='pb-12'>
      <section className='relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black to-[#0b0b0d] px-6 py-16 sm:px-10 sm:py-20 lg:px-16'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-red-600/20 blur-3xl' />
          <div className='absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-red-600/10 blur-3xl' />
        </div>

        <div className='mx-auto max-w-3xl text-center'>
          <span className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs text-gray-300'>
            <span className='inline-block h-1.5 w-1.5 rounded-full bg-red-500' />
            Live music tracker
          </span>
          <h1 className='mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
            Discover concerts & festivals.{' '}
            <span className='text-red-500'>Review</span>,{' '}
            <span className='text-red-500'>reserve</span>, and follow your
            favorite artists.
          </h1>
          <p className='mt-4 text-base text-gray-300 sm:text-lg'>
            Eventim keeps your music calendar in one place — browse events, read
            reviews, and save your seat in a few clicks.
          </p>

          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              to='/events'
              className='w-full rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 sm:w-auto'
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
