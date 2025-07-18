// components/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative hidden md:block' ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors'
      >
        <User size={18} />
        {user?.email}
      </button>

      {open && (
        <div className='absolute right-0 mt-2 w-48 bg-white shadow-md rounded z-50 animate-fade-in-up'>
          <button
            onClick={() => {
              navigate('/account');
              setOpen(false);
            }}
            className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm'
          >
            My Account
          </button>
          <button
            onClick={handleLogout}
            className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600'
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
