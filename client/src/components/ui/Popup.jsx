export default function Popup({ setIsOpen, children, closeBtn = false }) {
  return (
    <div className="relative h-dvh w-full bg-[#000000CC]">
      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[100%] max-w-[400px] bg-white p-4 shadow-md rounded-lg">
        {children}
        {closeBtn && (
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            className="button bg-red-500"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
