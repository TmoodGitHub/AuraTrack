// Layout.tsx
import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className='min-h-screen flex bg-gray-100 text-gray-900'>
      <Sidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div className='flex-1 flex flex-col'>
        {/* Top Navbar */}
        <header className='bg-white shadow-sm px-6 py-4 flex items-center justify-between'>
          <h1 className='text-xl font-bold text-gray-800'>AuraTrack</h1>

          {/* Email pill + Dropdown */}
          <div className='relative hidden md:block' ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className='flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition'
            >
              <User size={16} className='text-blue-700' />
              <span className='truncate max-w-[160px]'>
                {user?.email || 'User'}
              </span>
            </button>

            {dropdownOpen && (
              <div className='absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50 animate-fade-in-up'>
                <button
                  onClick={() => {
                    navigate('/account');
                    closeDropdown();
                  }}
                  className='w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                >
                  My Account
                </button>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className='md:hidden text-gray-600'
            onClick={toggleSidebar}
            aria-label='Toggle sidebar'
          >
            ☰
          </button>
        </header>

        {/* Main Content */}
        <main className='flex-1 px-6 py-8 max-w-5xl w-full mx-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
