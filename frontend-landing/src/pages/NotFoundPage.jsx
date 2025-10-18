import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function NotFoundPage() {
  return (
    <div className="bg-slate-50">
      <Header />
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-8xl font-bold text-blue-600">404</h1>
        <h2 className="text-4xl font-semibold text-slate-800 mt-4">
          Oops! Page Not Found.
        </h2>
        <p className="text-slate-500 mt-4 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Go to Homepage
        </Link>
      </main>
      <Footer />
    </div>
  );
}
