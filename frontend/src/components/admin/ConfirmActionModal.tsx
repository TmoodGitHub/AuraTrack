import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface ConfirmActionModalProps {
  open: boolean;
  action: 'promote' | 'demote' | 'delete' | null;
  user: { id: string; email: string } | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  open,
  action,
  user,
  onConfirm,
  onClose,
}) => {
  if (!open || !action || !user) return null;

  const actionVerbMap = {
    promote: 'Promote',
    demote: 'Demote',
    delete: 'Delete',
  };

  const actionColorMap = {
    promote: 'text-blue-700',
    demote: 'text-yellow-700',
    delete: 'text-red-700',
  };

  const buttonColorMap = {
    promote: 'bg-blue-600 hover:bg-blue-700',
    demote: 'bg-yellow-500 hover:bg-yellow-600',
    delete: 'bg-red-600 hover:bg-red-700',
  };

  const actionVerb = actionVerbMap[action];
  const colorClass = actionColorMap[action];
  const buttonClass = buttonColorMap[action];

  return (
    <Dialog open={open} onClose={onClose} className='fixed z-50 inset-0'>
      <div className='flex items-center justify-center min-h-screen px-4'>
        <div className='fixed inset-0 bg-black opacity-30' aria-hidden='true' />

        <div className='relative z-10 bg-white rounded-lg shadow-xl max-w-md w-full p-6'>
          <div className='flex justify-between items-start'>
            <Dialog.Title className='text-lg font-semibold'>
              Confirm {actionVerb}
            </Dialog.Title>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <X size={20} />
            </button>
          </div>

          <div className='mt-4 text-sm'>
            Are you sure you want to{' '}
            <span className={`${colorClass} font-medium`}>
              {actionVerb.toLowerCase()}
            </span>{' '}
            <strong>{user.email}</strong>?
          </div>

          <div className='mt-6 flex justify-end space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded text-white text-sm ${buttonClass}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
