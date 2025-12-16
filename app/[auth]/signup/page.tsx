import SignUpForm from "@/components/auth/signup-form";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign Up | Nexus",
    description: "Create your Nexus account",
};

export default function SignupPage() {
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Nexus
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create your account and start building
                    </p>
                </div>
                <SignUpForm />
            </div>
        </div>
    );
}