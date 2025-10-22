import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaYoutube, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='mt-12 border-t border-white/10 bg-black'>
      <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <span className='grid h-8 w-8 place-items-center rounded-lg bg-red-600 text-black font-black'>
                E
              </span>
              <span className='text-lg font-semibold text-white'>Eventim</span>
            </div>
            <p className='text-sm text-gray-400'>
              Discover, follow, and review concerts and festivals. A black and
              red rhythm for music lovers.
            </p>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
              Navigation
            </h3>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <Link className='text-gray-400 hover:text-white' to='/'>
                  Home
                </Link>
              </li>
              <li>
                <Link className='text-gray-400 hover:text-white' to='/events'>
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
              Resources
            </h3>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <a
                  className='text-gray-400 hover:text-white'
                  href='#'
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  className='text-gray-400 hover:text-white'
                  href='#'
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-300'>
              Follow us
            </h3>
            <div className='mt-3 flex gap-3'>
              <a
                href='#'
                aria-label='Twitter'
                onClick={(e) => e.preventDefault()}
                className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 hover:border-red-600 hover:bg-red-600/20 hover:text-white transition'
              >
                <FaTwitter className='h-5 w-5' />
              </a>
              <a
                href='#'
                aria-label='Instagram'
                onClick={(e) => e.preventDefault()}
                className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 hover:border-red-600 hover:bg-red-600/20 hover:text-white transition'
              >
                <FaInstagram className='h-5 w-5' />
              </a>
              <a
                href='#'
                aria-label='YouTube'
                onClick={(e) => e.preventDefault()}
                className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-300 hover:border-red-600 hover:bg-red-600/20 hover:text-white transition'
              >
                <FaYoutube className='h-5 w-5' />
              </a>
            </div>
          </div>
        </div>

        <div className='mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row'>
          <p className='text-xs text-gray-500'>
            © {new Date().getFullYear()} Eventim. All rights reserved.
          </p>
          <p className='text-xs text-gray-500 flex items-center'>
            Made with{' '}
            <span className='text-red-500'>
              <FaHeart className='text-red-500 mx-1' />
            </span>{' '}
            using React & Tailwind.
          </p>
        </div>
      </div>
    </footer>
  );
}
