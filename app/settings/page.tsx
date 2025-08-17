'use client';

import CustomerLayout, {CustomerCurrentPage} from "@/components/App/Layouts/CustomerLayout";
import {useSession} from "next-auth/react";
import type {AuthUserData} from "@/lib/types/auth";

import {useState} from 'react';
import {Card, CardContent} from '@/components/ui/card';
import {Bell, Shield, User} from 'lucide-react';
import TabProfile from "@/components/App/Setting/TabProfile";

export default function ProfilePage() {
    const {data: session} = useSession({required: true});

    const user: AuthUserData = session?.user;
    const [activeSection, setActiveSection] = useState('Profile');

    const sidebarItems = [
        {name: 'Profile', icon: User},
        {name: 'Security', icon: Shield},
        {name: 'Notifications', icon: Bell},
    ];

    return (
        <CustomerLayout currentPage={CustomerCurrentPage.Settings}>

            <div className="flex h-full bg-gray-50">
                {/* Settings Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200">
                    <div className="p-6">
                        <nav className="space-y-2">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => setActiveSection(item.name)}
                                        className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                                            activeSection === item.name
                                                ? 'bg-gray-100 text-gray-900 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 mr-3"/>
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="max-w-4xl">
                        <div className="mb-8">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Settings</h1>
                            <p className="text-gray-600">
                                Take full control of your account, preferences, and workflow to streamline your grant
                                application process.
                            </p>
                        </div>

                        {/* Profile Section */}
                        {activeSection === 'Profile' && (<TabProfile/>)}

                        {/* Security Section */}
                        {activeSection === 'Security' && (
                            <Card>
                                <CardContent className="p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Security</h2>
                                        <p className="text-gray-600">Manage your account security settings.</p>
                                    </div>
                                    <p className="text-gray-500">Security settings will be available here.</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'Notifications' && (
                            <Card>
                                <CardContent className="p-8">
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
                                        <p className="text-gray-600">Configure your notification preferences.</p>
                                    </div>
                                    <p className="text-gray-500">Notification settings will be available here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    )
}