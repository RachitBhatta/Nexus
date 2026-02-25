"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Bell, Palette, Users, CreditCard, Settings as SettingsIcon, ChevronRight } from "lucide-react";

export default function SettingsPage() {
    const router = useRouter();

    const settingsSections = [
        {
            icon: <User className="h-6 w-6" />,
            title: "Account Settings",
            description: "Manage your personal information and preferences",
            href: "/settings/account",
            color: "from-blue-600 to-blue-700"
        },
        {
            icon: <Shield className="h-6 w-6" />,
            title: "Security",
            description: "Password, 2FA, and security preferences",
            href: "/settings/security",
            color: "from-green-600 to-green-700"
        },
        {
            icon: <Bell className="h-6 w-6" />,
            title: "Notifications",
            description: "Configure how you receive updates",
            href: "/settings/notifications",
            color: "from-purple-600 to-purple-700"
        },
        {
            icon: <Palette className="h-6 w-6" />,
            title: "Appearance",
            description: "Customize the look and feel",
            href: "/settings/appearance",
            color: "from-pink-600 to-pink-700"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Team & Workspace",
            description: "Manage your team and workspace settings",
            href: "/settings/team",
            color: "from-orange-600 to-orange-700"
        },
        {
            icon: <CreditCard className="h-6 w-6" />,
            title: "Billing & Plans",
            description: "Manage subscription and payment methods",
            href: "/settings/billing",
            color: "from-indigo-600 to-indigo-700"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white">
                            <SettingsIcon className="h-5 w-5" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Settings Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {settingsSections.map((section, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-lg transition-all group border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-500"
                            onClick={() => router.push(section.href)}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                        {section.icon}
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                                <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {section.title}
                                </CardTitle>
                                <CardDescription className="leading-relaxed">
                                    {section.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>

                {/* Quick Info Card */}
                <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white flex-shrink-0">
                                <SettingsIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    Need Help with Settings?
                                </h3>
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                                    Check out our documentation or contact support for assistance with any configuration questions.
                                </p>
                                <div className="flex items-center space-x-3">
                                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                        View Documentation →
                                    </button>
                                    <span className="text-blue-400">|</span>
                                    <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                        Contact Support →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}