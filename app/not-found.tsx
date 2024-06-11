import Link from 'next/link'
import React from "react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 text-display-2xl">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-display-xl">Page Not Found</h2>
            <p className="text-gray-900 mb-6">The page you are looking for has moved, or doesn't exist.</p>
            <Link href="/">
                <button className="bg-primary-600 hover:bg-status-bar-active text-white font-bold py-3 px-12 rounded text-xl">
                    Go Home
                </button>
            </Link>
        </div>
    );
}