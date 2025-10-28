import React from "react";

export default function CTA() {
  const kiteAppUrl =
    import.meta.env.VITE_KITE_APP_URL || "http://localhost:5173";

  return (
    <section className="bg-slate-800 text-white">
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Begin Your Investment Journey?
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto mb-10">
          Join thousands of smart investors who trust Finvesto for their trading
          needs.
        </p>
        <a
          href={`${kiteAppUrl}/signup`}
          className="bg-cyan-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-cyan-300 transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Get Started with Finvesto
        </a>
      </div>
    </section>
  );
}
