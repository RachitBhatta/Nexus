import React from 'react';

const Loading = () => (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="space-y-6">
            <div className="flex items-end justify-center gap-1.5 h-12">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="w-1 bg-neutral-700 animate-pulse"
                        style={{
                            height: `${30 + i * 8}%`,
                            animationDelay: `${i * 150}ms`,
                            animationDuration: '1.4s',
                        }}
                    />
                ))}
            </div>

            <p className="text-sm text-neutral-500 text-center tracking-wide">Loading</p>

            <div className="w-32 mx-auto h-px bg-gradient-to-r from-transparent via-blue-950 to-transparent opacity-60" />
        </div>
    </main>
);

export default Loading;
