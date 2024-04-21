import { X } from 'lucide-react';

export default function Popup({ setIsOpen, children, closeBtn = false, topCloseBtn = false }) {

  function handleClose() {
    setIsOpen(false);
  }
  return (
    <div className="relative h-dvh w-full bg-[#000000CC]">
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[100%] max-w-[400px] bg-white p-4 shadow-md rounded-lg">
        {topCloseBtn && (
          <button className='button ms-auto p-1 bg-red-500 hover:bg-red-700 text-white' onClick={handleClose}>
            <X color="#ffffff" />
          </button>
        )}
        {children}
        {closeBtn && (
          <button
            onClick={handleClose}
            className="button bg-red-500 hover:bg-red-700 text-white"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
