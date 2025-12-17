import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
            { label: "Roadmap", href: "/roadmap" },
            { label: "Changelog", href: "/changelog" },
        ],
        resources: [
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/api-docs" },
            { label: "Blog", href: "/blog" },
            { label: "Community", href: "/community" },
        ],
        company: [
            { label: "About", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy", href: "/privacy" },
        ],
        legal: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Security", href: "/security" },
        ],
    };

    const socialLinks = [
        { icon: Github, href: "https://github.com/nexus", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com/nexus", label: "Twitter" },
        { icon: Linkedin, href: "https://linkedin.com/company/nexus", label: "LinkedIn" },
        { icon: Mail, href: "mailto:hello@nexus.dev", label: "Email" },
    ];

    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Nexus
                            </span>
                        </Link>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
                            The ultimate collaborative pre-production platform for developers. Build, plan, and
                            create together.
                        </p>
                        {/* Social Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gradient-to-br hover:from-gray-900 hover:to-gray-700 dark:hover:from-gray-100 dark:hover:to-gray-300 flex items-center justify-center transition-all group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-900" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Product</h3>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Resources</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="font-semibold text-sm mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © {currentYear} Nexus. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6">
                            <Link
                                href="/status"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                System Status
                            </Link>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}