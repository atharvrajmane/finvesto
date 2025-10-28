import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const kiteAppUrl =
    import.meta.env.VITE_KITE_APP_URL || "http://localhost:5173";

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-slate-900">
          FINVESTO
        </Link>
        <div className="flex items-center space-x-4">
          <a
            href={`${kiteAppUrl}/login`}
            className="hidden sm:block text-slate-600 hover:text-blue-600 font-semibold transition duration-300"
          >
            Log In
          </a>
          <a
            href={`${kiteAppUrl}/signup`}
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
          >
            Sign Up
          </a>
        </div>
      </nav>
    </header>
  );
}
