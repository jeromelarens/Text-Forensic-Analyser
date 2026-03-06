import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="w-full min-h-screen bg-primary">
      <Navbar />

      {/* SINGLE CENTER SPINE */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
