import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='min-h-dvh bg-[#0b0b0d] text-gray-100'>
      <Navbar />
      <main id='main' className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
