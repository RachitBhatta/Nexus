import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
    title: {
        template: "%s | Nexus Authentication",
        default: "Nexus Authentication",
    },
    description: "Secure authentication for Nexus platform",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                {/* Gradient Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-gray-200 to-transparent dark:from-gray-800 dark:to-transparent rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-gray-300 to-transparent dark:from-gray-700 dark:to-transparent rounded-full blur-3xl opacity-50"></div>
            </div>

            {/* Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}