"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TwoFASetup from "@/components/auth/2fa-setup";
import { Loader2, ShieldCheck } from "lucide-react";

export default function TwoFASetupPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("/api/auth/session", {
                    credentials: "include",
                });
                const data = await response.json();

                if (!data.authenticated) {
                    router.push("/login");
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                router.push("/login");
            }
        }

        checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <ShieldCheck className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Two-Factor Authentication
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                    </p>
                </div>

                <TwoFASetup />
\
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Supported Apps:</strong> Google Authenticator, Authy, Microsoft Authenticator, or any TOTP-compatible app.
                    </p>
                </div>
            </div>
        </div>
    );
}