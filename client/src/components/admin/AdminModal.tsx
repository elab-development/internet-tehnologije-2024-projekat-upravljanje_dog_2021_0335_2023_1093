import React from 'react';

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
};

const AdminModal: React.FC<Props> = ({
  open,
  title,
  onClose,
  children,
  maxWidthClass = 'max-w-lg',
}) => {
  if (!open) return null;
  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/70' onClick={onClose} />
      <div
        className={`relative w-full ${maxWidthClass} rounded-2xl border border-white/10 bg-[#0b0b0d] p-5 text-gray-100 shadow-xl`}
      >
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-white'>{title}</h3>
          <button
            onClick={onClose}
            className='rounded-lg px-2 py-1 text-sm text-gray-300 hover:bg-white/10'
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminModal;
