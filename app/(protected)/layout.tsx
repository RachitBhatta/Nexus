import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth/token";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
    title: {
        template: "%s | Nexus",
        default: "Nexus Dashboard",
    },
};

async function getUser() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) return null;

        const decoded = verifyToken(accessToken);
        return {
            username: decoded.username,
            email: decoded.email,
            twoFactorEnabled: decoded.twoFactorEnabled,
        };
    } catch {
        return null;
    }
}

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            {/* ✅ NAVBAR FOR LOGGED-IN USERS */}
            <Header user={user} />

            {/* Content with top padding for fixed header */}
            <main className="flex-1 pt-16">
                {children}
            </main>

            <Footer />
        </div>
    );
}