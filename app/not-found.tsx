import React from 'react';

const NotFound = () => (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-3">
                <h1 className="text-8xl font-light tracking-tight text-white">404</h1>
                <div className="h-px bg-neutral-800 w-16 mx-auto" />
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-medium text-neutral-400">Page not found</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    The page you're looking for doesn't exist or has been moved.
                </p>
            </div>

            <button className="inline-block px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors duration-200">
                Return Home
            </button>
        </div>
    </main>
);

export default NotFound;
