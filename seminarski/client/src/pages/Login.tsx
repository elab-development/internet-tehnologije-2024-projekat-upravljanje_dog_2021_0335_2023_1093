import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location.state?.from ?? '/';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await login(form);
    if (res.ok) {
      navigate(redirectTo, { replace: true });
    } else {
      setErr(typeof res.error === 'string' ? res.error : 'Wrong credentials');
    }
  };

  return (
    <div className='pb-12'>
      <section className='relative isolate overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-black to-[#0b0b0d] px-6 py-12 sm:px-10 sm:py-16 lg:px-16'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <div className='absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-red-600/20 blur-3xl' />
          <div className='absolute -bottom-24 left-[-10%] h-72 w-72 rounded-full bg-red-600/10 blur-3xl' />
        </div>

        <div className='mx-auto max-w-md'>
          <h1 className='text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
            Welcome back
          </h1>
          <p className='mt-2 text-sm text-gray-300'>
            Log in to manage your tickets and account settings.
          </p>

          <form onSubmit={onSubmit} className='mt-8 space-y-4'>
            <div>
              <label className='block text-sm text-gray-300 mb-1'>Email</label>
              <input
                type='email'
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600'
                placeholder='you@example.com'
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className='block text-sm text-gray-300 mb-1'>
                Password
              </label>
              <input
                type='password'
                className='w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-500 focus:border-red-600'
                placeholder='••••••••'
                value={form.password}
                onChange={(e) =>
                  setForm((s) => ({ ...s, password: e.target.value }))
                }
                required
                minLength={8}
              />
            </div>

            {err && (
              <p className='text-sm text-red-400 bg-red-400/10 rounded-xl px-3 py-2'>
                {err}
              </p>
            )}

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-60'
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className='mt-4 text-sm text-gray-400'>
            New here?{' '}
            <Link to='/register' className='text-red-400 hover:text-red-300'>
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
