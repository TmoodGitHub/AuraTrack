import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (!user) {
    return (
      <main className='min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 px-6'>
        <Outlet />
      </main>
    );
  }

  return (
    <div className='min-h-screen flex bg-gray-100 text-gray-900'>
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      <div className='flex-1 flex flex-col'>
        <header className='bg-white shadow-sm px-6 py-4 flex items-center justify-between'>
          <h1 className='text-xl font-bold text-gray-800'>AuraTrack</h1>
          <button
            className='md:hidden text-gray-600'
            onClick={toggleSidebar}
            aria-label='Toggle sidebar'
          >
            ☰
          </button>
        </header>

        <main className='flex-1 px-6 py-8 max-w-5xl w-full mx-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
