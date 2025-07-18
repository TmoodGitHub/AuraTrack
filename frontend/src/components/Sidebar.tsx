import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar = ({ isOpen, toggle }: Props) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/40 z-40 md:hidden'
          onClick={toggle}
        />
      )}

      <aside
        className={`bg-white shadow-md px-4 py-6 w-64 h-full fixed z-50 top-0 left-0 transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:block`}
      >
        <button
          className='md:hidden mb-4 text-sm text-gray-500 underline'
          onClick={toggle}
        >
          Close
        </button>

        <div className='flex flex-col justify-between h-full'>
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
              Dashboard
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
              Admin Portal
            </NavLink>
          </nav>

          <button
            onClick={handleLogout}
            className='mt-6 text-left text-red-600 hover:text-red-800 px-3 py-2 flex items-center gap-2 rounded'
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
