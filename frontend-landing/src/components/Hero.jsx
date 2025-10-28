import React from 'react';

export default function Hero() {
    const kiteAppUrl = import.meta.env.VITE_KITE_APP_URL || "http://localhost:5173";

    return (
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                    The Future of Trading is Here.
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10">
                    Experience seamless trading, real-time insights, and intelligent investments, all in one powerful platform designed for you.
                </p>
                <a href={`${kiteAppUrl}/signup`} className="bg-cyan-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-lg hover:bg-cyan-300 transition duration-300 transform hover:scale-105 shadow-lg">
                    Start Trading Now
                </a>
                <p className="text-slate-400 mt-6 text-sm">No account minimums &bull; Transparent pricing &bull; Secure platform</p>
            </div>
        </section>
    );
}
