"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings, Shield } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
    user?: {
        username: string;
        email: string;
        twoFactorEnabled: boolean;
    } | null;
}

export default function Header({ user }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navLinks = [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/projects", label: "Projects" },
        { href: "/chat", label: "Chat" },
        { href: "/docs", label: "Docs" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
                }`}
        >
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="relative w-10 h-10">
                            <Image
                                src="https://i.imgur.com/fbQdA6z.png"
                                alt="Nexus Logo"
                                fill
                                className="object-contain group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                            Nexus
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden md:flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${pathname === link.href
                                            ? "bg-gradient-to-r from-gray-900 to-gray-700 text-white dark:from-gray-100 dark:to-gray-300 dark:text-gray-900"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Desktop User Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 flex items-center justify-center text-white dark:text-gray-900 font-semibold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">{user.username}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-medium">{user.username}</p>
                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings/security" className="cursor-pointer">
                                            <Shield className="mr-2 h-4 w-4" />
                                            Security
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600 dark:text-red-400"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link href="/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button className="bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t dark:border-gray-800">
                        {user ? (
                            <>
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`block px-4 py-2 rounded-lg text-sm font-medium ${pathname === link.href
                                                ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                                                : "text-gray-700 dark:text-gray-300"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t dark:border-gray-800">
                                    <Link
                                        href="/settings"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                    <Button variant="ghost" className="w-full">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-gray-900 to-gray-700">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    );
}
