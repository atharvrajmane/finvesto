import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400">
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Finvesto. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy" className="hover:text-white transition duration-300">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-white transition duration-300">Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}
