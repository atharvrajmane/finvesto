import React from 'react';
// 1. Import the specific icons you need from the library
import {
    TrendingUp,
    Search,
    SwapHoriz,
    ShieldOutlined
} from '@mui/icons-material';

// 2. Replace the inline SVG with the imported component
const featuresData = [
    {
        icon: <TrendingUp sx={{ fontSize: 40 }} />,
        title: "Real-time Market Data",
        description: "Stay ahead of the market with lightning-fast stock prices, advanced charts, and breaking financial news."
    },
    {
        icon: <Search sx={{ fontSize: 40 }} />,
        title: "Intelligent Insights",
        description: "Leverage powerful analytics and smart filters to discover your next great investment opportunity."
    },
    {
        icon: <SwapHoriz sx={{ fontSize: 40 }} />,
        title: "Effortless Trading",
        description: "A clean, intuitive interface designed for speed. Buy and sell stocks seamlessly in just a few clicks."
    },
    {
        icon: <ShieldOutlined sx={{ fontSize: 40 }} />,
        title: "Bank-Grade Security",
        description: "Your data, privacy, and funds are protected with industry-leading encryption and security protocols."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Finvesto?</h2>
                <p className="text-slate-500 max-w-2xl mx-auto mb-16">Everything you need to trade smarter, not harder.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuresData.map((feature, index) => (
                        <div key={index} className="bg-slate-100 p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-slate-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

