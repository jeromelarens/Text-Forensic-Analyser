export default function PageContainer({ children }) {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-6">
        {children}
      </div>
    </div>
  );
}
