// Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isCollapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, toggle, isCollapsed, setCollapsed }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40 md:hidden'
          onClick={toggle}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`bg-white shadow-md py-6 pb-6 h-full fixed z-50 top-0 left-0 transition-all duration-200 ease-in-out
          ${isOpen ? 'translate-x-0 w-64 px-4' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-screen
          ${
            !isOpen ? (isCollapsed ? 'md:w-16 md:px-2' : 'md:w-64 md:px-4') : ''
          }
        `}
      >
        {/* Close for mobile */}
        <button
          className='md:hidden mb-4 text-sm text-gray-500 underline'
          onClick={toggle}
        >
          Close
        </button>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className='hidden md:block mb-6 text-gray-500 hover:text-gray-700'
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        <div className='flex flex-col justify-between h-full pb-8'>
          <nav className='flex flex-col gap-4'>
            <NavLink
              to='/dashboard'
              end
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-600 text-white font-semibold px-3 py-2 rounded flex items-center gap-2'
                  : 'text-gray-700 hover:text-blue-500 px-3 py-2 rounded flex items-center gap-2'
              }
            >
              <LayoutDashboard size={18} />
              <span className={`md:${isCollapsed ? 'hidden' : 'inline'}`}>
                Dashboard
              </span>
            </NavLink>

            <NavLink
              to='/admin'
              end
              className={({ isActive }) =>
                isActive
                  ? 'bg-blue-600 text-white font-semibold px-3 py-2 rounded flex items-center gap-2'
                  : 'text-gray-700 hover:text-blue-500 px-3 py-2 rounded flex items-center gap-2'
              }
            >
              <Shield size={18} />
              <span className={`md:${isCollapsed ? 'hidden' : 'inline'}`}>
                Admin Portal
              </span>
            </NavLink>

            {/* Mobile Only: My Account */}
            <NavLink
              to='/account'
              className='md:hidden text-gray-700 hover:text-blue-500 px-3 py-2 rounded flex items-center gap-2'
            >
              <User size={18} />
              My Account
            </NavLink>
          </nav>

          {/* Mobile Only: Logout (Pill) */}
          <button
            onClick={handleLogout}
            className='md:hidden mt-6 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-full flex items-center gap-2 text-sm transition'
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
