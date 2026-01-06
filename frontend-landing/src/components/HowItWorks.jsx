import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Get Started in 3 Simple Steps
        </h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-slate-300 -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-blue-600 shadow-lg border-4 border-slate-200">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Account</h3>
              <p className="text-slate-500">
                Sign up in minutes with your email and a few details. It's fast
                and secure.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-blue-600 shadow-lg border-4 border-slate-200">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Funds</h3>
              <p className="text-slate-500">
                Securely link your bank account and add funds to your trading
                portfolio.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-blue-600 shadow-lg border-4 border-slate-200">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Trading</h3>
              <p className="text-slate-500">
                Explore markets, place orders, and begin your investment
                journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
