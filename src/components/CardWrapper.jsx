export default function CardWrapper({ children, className = '' }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-5 ${className}`}>
      {children}
    </div>
  );
}