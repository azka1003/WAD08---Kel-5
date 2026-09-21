// src/components/Button.jsx
export default function Button({ children, variant = 'emerald', onClick, isFull = false }) {
  
  const colors = {
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    blue: 'text-blue-600 hover:text-blue-800 font-medium',
    pink: 'text-pink-600 hover:text-pink-800 font-medium',
  };

  return (
    <button
      onClick={onClick}
      //  menambahkan class 'w-full' jika isFull bernilai true
      className={`px-4 py-2 rounded-lg transition-all duration-200 ${colors[variant]} ${isFull ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}