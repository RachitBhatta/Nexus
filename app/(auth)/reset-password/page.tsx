import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Reset Password | Nexus",
    description: "Create a new password for your Nexus account",
};

function ResetPasswordLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create a strong password for your account
                    </p>
                </div>


                <Suspense fallback={<ResetPasswordLoading />}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Security Tip:</strong> Use a unique password that you don't use on other websites.
                    </p>
                </div>
            </div>
        </div>
    );
}