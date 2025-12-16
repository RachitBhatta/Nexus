import React from 'react';

const GlobalError = () => (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
            <div className="space-y-3">
                <div className="w-16 h-16 mx-auto border-2 border-neutral-800 flex items-center justify-center">
                    <span className="text-2xl text-neutral-600">!</span>
                </div>
                <div className="h-px bg-neutral-800 w-16 mx-auto" />
            </div>

            <div className="space-y-3">
                <h2 className="text-xl font-medium text-neutral-400">Something went wrong</h2>
                <p className="text-sm text-neutral-600 leading-relaxed">
                    An unexpected error occurred. Please try again.
                </p>
            </div>

            <button className="inline-block px-6 py-2.5 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors duration-200">
                Try Again
            </button>
        </div>
    </main>
);

export default GlobalError;
