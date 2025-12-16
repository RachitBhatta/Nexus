import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";
import Image from "next/image";


export const metadata: Metadata = {
    title: "Login | Nexus",
    description: "Sign in to  your nexus account"
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-[150] dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <Image
                    src="https://i.imgur.com/fbQdA6z.png"
                    alt="Nexus Image"
                    height={24}
                    width={24}
                />
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Nexus
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back! Please login to continue.
                    </p>
                </div>
                <LoginForm/>
            </div>
        </div>
    )
}