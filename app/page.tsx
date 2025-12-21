import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Users, Zap, Shield, GitBranch, MessageSquare, Sparkles, CheckCircle2, Star } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo.svg"
                                    alt="Nexus Logo"
                                    fill
                                    className="object-contain group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                Nexus
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                How It Works
                            </Link>
                            <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                Pricing
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="ghost" className="hidden md:inline-flex">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto text-center max-w-5xl">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-8 animate-fade-in">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">AI-Powered Development Platform</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                            Connect. Code.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            Create Together.
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        The ultimate collaborative pre-production platform for developers. Plan, brainstorm, and structure your projects with AI assistance before writing a single line of production code.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
                        <Link href="/signup">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-lg">
                                Start Building Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works">
                            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                                Watch Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {[
                            { value: "10K+", label: "Active Users" },
                            { value: "50K+", label: "Projects Created" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "24/7", label: "Support" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            Everything You Need to Build Faster
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Powerful features designed to streamline your development workflow from ideation to execution.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Code2 className="h-8 w-8" />,
                                title: "AI-Powered Code Generation",
                                description: "Get intelligent code suggestions and algorithm templates powered by GPT-4 to accelerate your development."
                            },
                            {
                                icon: <Users className="h-8 w-8" />,
                                title: "Real-Time Collaboration",
                                description: "Work together seamlessly with voice/video calls, project chat rooms, and live code sharing."
                            },
                            {
                                icon: <GitBranch className="h-8 w-8" />,
                                title: "GitHub Integration",
                                description: "Sync your repositories, track changes, and manage your codebase directly from Nexus."
                            },
                            {
                                icon: <MessageSquare className="h-8 w-8" />,
                                title: "Smart Project Chat",
                                description: "Context-aware chat rooms for each project with code snippet sharing and file attachments."
                            },
                            {
                                icon: <Zap className="h-8 w-8" />,
                                title: "Lightning Fast",
                                description: "Built on Next.js 15 with optimized performance for instant page loads and smooth interactions."
                            },
                            {
                                icon: <Shield className="h-8 w-8" />,
                                title: "Enterprise Security",
                                description: "2FA authentication, role-based access control, and encrypted data storage for peace of mind."
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl"
                            >
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            Simple, Yet Powerful
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Get started in minutes and collaborate like never before
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {[
                            {
                                step: "01",
                                title: "Create Your Workspace",
                                description: "Sign up and create your first workspace in seconds. Invite team members and set up your project structure."
                            },
                            {
                                step: "02",
                                title: "Connect Your Tools",
                                description: "Integrate with GitHub, configure your project settings, and let AI analyze your codebase for intelligent suggestions."
                            },
                            {
                                step: "03",
                                title: "Collaborate & Build",
                                description: "Start real-time collaboration with your team. Chat, share code, and build amazing projects together with AI assistance."
                            }
                        ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-6 group">
                                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                    {item.step}
                                </div>
                                <div className="flex-1 pt-2">
                                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            Loved by Developers Worldwide
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Full Stack Developer",
                                content: "Nexus has transformed how our team collaborates. The AI suggestions are incredibly accurate and save us hours of planning time.",
                                rating: 5
                            },
                            {
                                name: "Michael Rodriguez",
                                role: "Tech Lead @ StartupCo",
                                content: "The real-time collaboration features are game-changing. We can brainstorm, code, and review together seamlessly.",
                                rating: 5
                            },
                            {
                                name: "Emily Watson",
                                role: "Software Engineer",
                                content: "Best platform for pre-production work. The GitHub integration and project management tools are exactly what we needed.",
                                rating: 5
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Workflow?
                    </h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                        Join thousands of developers who are building faster and smarter with Nexus.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
                            Start Free Trial
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Image
                                    src="https://i.imgur.com/fbQdA6z.png"
                                    alt="Nexus"
                                    width={32}
                                    height={32}
                                />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Nexus</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Empowering developers to build the future, together.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Features</Link></li>
                                <li><Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Pricing</Link></li>
                                <li><Link href="/docs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Documentation</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">About</Link></li>
                                <li><Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Careers</Link></li>
                                <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</Link></li>
                                <li><Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</Link></li>
                                <li><Link href="/security" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Security</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Nexus. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}