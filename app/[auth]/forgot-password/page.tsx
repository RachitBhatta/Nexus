import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Forgot Password | Nexus",
    description: "Reset your Nexus account password",
};

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="w-full max-w-md">
                <Image
                    src="https://i.imgur.com/fbQdA6z.png"
                    height={24}
                    width={24}
                    alt="Nexus Logo"
                />
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Forgot Password?
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        No worries, we'll send you reset instructions
                    </p>
                </div>


                <ForgotPasswordForm />


                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Tip:</strong> Check your spam folder if you don't receive the email within 5 minutes.
                    </p>
                </div>
            </div>
        </div>
    );
}