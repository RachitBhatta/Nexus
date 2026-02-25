"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    ArrowUpRight,
    Code2,
    FolderGit2,
    GitBranch,
    MessageSquare,
    Plus,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState("7d");
    const [stats, setStats] = useState([]);
    const [recentProjects, setRecentProjects] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const iconMap = {
        FolderGit2: <FolderGit2 className="h-5 w-5" />,
        Users: <Users className="h-5 w-5" />,
        GitBranch: <GitBranch className="h-5 w-5" />,
        Zap: <Zap className="h-5 w-5" />,
        Plus: <Plus className="h-5 w-5" />,
        Code2: <Code2 className="h-5 w-5" />,
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Fetch stats
                const statsRes = await fetch("/api/stats");
                const statsData = await statsRes.json();
                // Map icons from API if needed
                const mappedStats = statsData.map((item) => ({
                    ...item,
                    icon: iconMap[item.iconName] || <FolderGit2 className="h-5 w-5" />
                }));
                setStats(mappedStats);

                // Fetch recent projects
                const projectsRes = await fetch("/api/projects");
                const projectsData = await projectsRes.json();
                setRecentProjects(projectsData);

                // Fetch recent activity
                const activityRes = await fetch("/api/activity");
                const activityData = await activityRes.json();
                setRecentActivity(activityData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back! 👋
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Here's what's happening with your projects today.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                        <Button variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Team Chat
                        </Button>
                        <Link href="/projects/new">
                            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    {stat.title}
                                </CardTitle>
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white">
                                    {stat.icon}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                    {stat.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Projects */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Projects</CardTitle>
                                        <CardDescription>
                                            Your active and recent projects
                                        </CardDescription>
                                    </div>
                                    <Link href="/projects">
                                        <Button variant="ghost" size="sm">
                                            View All
                                            <ArrowUpRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentProjects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {project.name}
                                                        </h3>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'active'
                                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                            }`}>
                                                            {project.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {project.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1" />
                                                        {project.members} members
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Activity className="h-4 w-4 mr-1" />
                                                        {project.lastActivity}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-700"
                                                            style={{ width: `${project.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {project.progress}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>
                                    Get started with common tasks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: <Plus className="h-5 w-5" />, label: "New Project" },
                                        { icon: <Users className="h-5 w-5" />, label: "Invite Team" },
                                        { icon: <Code2 className="h-5 w-5" />, label: "AI Assistant" },
                                        { icon: <GitBranch className="h-5 w-5" />, label: "Connect GitHub" }
                                    ].map((action, index) => (
                                        <button
                                            key={index}
                                            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all group"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform">
                                                {action.icon}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {action.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Activity Feed */}
                    <div>
                        <Card className="h-fit sticky top-20">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>
                                    Latest updates from your team
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                                {activity.user.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    <span className="font-medium">{activity.user}</span>{" "}
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {activity.action}
                                                    </span>{" "}
                                                    <span className="font-medium">{activity.target}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-4">
                                    View All Activity
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
