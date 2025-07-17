import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className='min-h-screen bg-gray-100 text-gray-900'>
    {/** Top Navbar */}
    <header className='bg-white shadow-sm px-6 py-4'>
      <h1 className='text-xl font-bold text-gray-800'>AuraTrack</h1>
    </header>

    {/** Main Content */}
    <main className='max-w-4xl mx-auto px-6 py-8'>
      <Outlet />
    </main>
  </div>
);

export default Layout;
