import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { IoCloseOutline, IoMenu } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <span className='grid h-8 w-8 place-items-center rounded-lg bg-red-600 text-black font-black'>
            E
          </span>
          <span className='text-lg font-semibold tracking-wide text-white'>
            Eventim
          </span>
        </Link>

        {/* Desktop links */}
        <ul className='hidden gap-1 md:flex'>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-red-600/20'
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          {/* Admin link (desktop) */}
          {user?.role === 'admin' && (
            <li>
              <NavLink
                to='/admin'
                className={({ isActive }) =>
                  isActive
                    ? 'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'inline-flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-200 hover:text-white hover:bg-red-600/20'
                }
              >
                Admin
              </NavLink>
            </li>
          )}
        </ul>

        {/* Right side (CTA / Auth) */}
        <div className='hidden md:flex items-center gap-2'>
          {!isAuthenticated ? (
            <>
              <Link
                to='/login'
                className='rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-red-600/20 hover:text-white'
              >
                Sign in
              </Link>
              <Link
                to='/register'
                className='rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              <Link
                to='/account'
                className='rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-red-600/20 hover:text-white'
                title={user?.email}
              >
                Account
              </Link>
              <button
                onClick={handleLogout}
                className='rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
              >
                Sign out
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(!open)}
          className='inline-flex items-center justify-center rounded-xl p-2 text-gray-200 hover:bg-red-600/20 md:hidden'
        >
          {open ? (
            <IoCloseOutline className='h-6 w-6' />
          ) : (
            <IoMenu className='h-6 w-6' />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className='md:hidden border-t border-white/10 bg-black/95'>
          <ul className='mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8'>
            {navItems.map((item) => (
              <li key={item.to} className='py-1'>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? 'block rounded-xl px-3 py-2 text-base bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'block rounded-xl px-3 py-2 text-base text-gray-200 hover:text-white hover:bg-red-600/20'
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}

            {/* Admin link (mobile) */}
            {user?.role === 'admin' && (
              <li className='py-1'>
                <NavLink
                  to='/admin'
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? 'block rounded-xl px-3 py-2 text-base bg-red-600 text-white shadow-lg shadow-red-600/30'
                      : 'block rounded-xl px-3 py-2 text-base text-gray-200 hover:text-white hover:bg-red-600/20'
                  }
                >
                  Admin
                </NavLink>
              </li>
            )}

            {!isAuthenticated ? (
              <>
                <li className='pt-2'>
                  <Link
                    to='/login'
                    onClick={() => setOpen(false)}
                    className='block rounded-xl border border-white/10 px-3 py-2 text-center text-base text-gray-200 hover:bg-red-600/20 hover:text-white'
                  >
                    Sign in
                  </Link>
                </li>
                <li className='pt-2'>
                  <Link
                    to='/register'
                    onClick={() => setOpen(false)}
                    className='block rounded-xl bg-red-600 px-3 py-2 text-center text-base font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
                  >
                    Sign up
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='pt-2'>
                  <Link
                    to='/account'
                    onClick={() => setOpen(false)}
                    className='block rounded-xl border border-white/10 px-3 py-2 text-center text-base text-gray-200 hover:bg-red-600/20 hover:text-white'
                  >
                    Account
                  </Link>
                </li>
                <li className='pt-2'>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className='w-full rounded-xl bg-red-600 px-3 py-2 text-center text-base font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500'
                  >
                    Sign out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
