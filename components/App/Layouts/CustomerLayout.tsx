/** biome-ignore-all lint/a11y/useKeyWithClickEvents: true */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: true */

import {Avatar} from "antd";
import {
    BadgePoundSterlingIcon,
    Bell,
    BlocksIcon,
    BookmarkCheckIcon,
    ChevronsUpDown,
    HeartHandshakeIcon,
    HelpCircle,
    LibraryBigIcon,
    LogOut,
    Menu,
    SendIcon,
    Settings,
    User,
    X,
} from 'lucide-react';
import Image from "next/image";
import {signOut, useSession} from "next-auth/react";
import React, {useEffect, useState} from 'react';
import {DEFAULT_AVATAR} from "@/lib/constants/user";
import {authUrl} from "@/lib/helpers/url";
import type {AuthUserData} from "@/lib/types/auth";
import Link from "next/link";
import {clearBearerToken} from "@/lib/helpers/auth";
import {useHandleUncompletedRegistration} from "@/lib/helpers/auth.client";

interface IProps {
    children: React.ReactNode;
    topLeftContent?: React.ReactNode;
    currentPage?: CustomerCurrentPage;
}

export enum CustomerCurrentPage {
    Dashboard = 'dashboard',
    Users = 'users',
    Opportunities = 'opportunities',
    SavedOpportunities = 'saved-opportunities',
    AppliedOpportunities = 'applied-opportunities',
    LoanList = 'loan-list',
    VcDatabase = 'vc-database',
    Resources = 'resources',
    Settings = 'settings',
}

const CustomerLayout = (props: IProps) => {
    const {children, currentPage, topLeftContent} = props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const {data: session} = useSession({required: true});

    const user: AuthUserData = session?.user;

    useHandleUncompletedRegistration(user)

    const profilePicture = user?.profile_picture ? authUrl(user.profile_picture) : DEFAULT_AVATAR;

    const theCurrentPage = currentPage ?? CustomerCurrentPage.Dashboard;

    const sidebarItems = [
        {
            icon: BlocksIcon,
            label: "Opportunities",
            href: "/opportunities",
            page: CustomerCurrentPage.Opportunities,
        },
        {
            icon: BookmarkCheckIcon,
            label: "Saved Opportunities",
            href: "/saved-opportunities",
            page: CustomerCurrentPage.SavedOpportunities,
        },
        {
            icon: SendIcon,
            label: "Applied Opportunities",
            href: "/applied-opportunities",
            page: CustomerCurrentPage.AppliedOpportunities,
        },
        {
            icon: BadgePoundSterlingIcon,
            label: "Loan Database",
            href: "/loan-database",
            page: CustomerCurrentPage.LoanList,
        },
        {
            icon: HeartHandshakeIcon,
            label: "VC Database",
            href: "/vc-database",
            page: CustomerCurrentPage.VcDatabase,
        },
        {
            icon: LibraryBigIcon,
            label: "Resources",
            href: "/resources",
            page: CustomerCurrentPage.Resources,
        },
        {
            icon: Settings,
            label: "Settings",
            href: "/settings",
            page: CustomerCurrentPage.Settings,
        },
    ];


    const logout = async () => {
        clearBearerToken()
        await signOut({redirect: true, callbackUrl: '/login'});
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Profile Dropdown Overlay */}
            {profileDropdownOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#006A4B] text-white 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
      `}>
                <div className="p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-lg lg:text-xl font-bold">
                            <Image width={200} height={200} src="/images/financeher-white.png" alt="Financeher"/>
                        </div>

                        {/* Close button for mobile */}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-emerald-700 rounded"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                </div>

                <nav className="mt-4 lg:mt-8 px-2">
                    {sidebarItems.map((item, index) => (
                        <Link href={item.href} className="!text-white" key={index}>
                            <div
                                className={`px-4 lg:px-6 py-3 mt-1 rounded-4xl cursor-pointer ${
                                    theCurrentPage === item.page ? 'bg-[#214F47]' : 'hover:bg-emerald-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4 lg:w-5 lg:h-5"/>
                                    <span className="text-sm lg:text-base">{item.label}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 lg:ml-0">
                {/* Header */}
                <div className="bg-white border-b px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {topLeftContent}
                        <div className="flex items-center gap-4">
                            {/* Mobile menu button */}
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Menu className="w-5 h-5"/>
                            </button>


                        </div>

                        <div className="flex items-center gap-2 lg:gap-4">
                            {/* Notifications */}
                            <button type="button" className="p-2 hover:bg-gray-100 rounded-lg relative">
                                <Bell className="w-5 h-5 text-gray-600"/>
                                <span
                                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg border border-gray-200"
                                >
                                    <div
                                        className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center">
                                        {/*<span className="text-white text-xs lg:text-sm font-semibold">NO</span>*/}
                                        <Avatar size="large" src={profilePicture}/>
                                    </div>
                                    <span
                                        className="text-xs lg:text-sm font-medium hidden sm:inline">{user?.full_name}</span>
                                    <ChevronsUpDown className="ms-5 w-4 h-4 text-gray-500 hidden sm:inline"/>
                                </button>

                                {/* Dropdown Menu */}
                                {profileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 mt-1 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                type="button"
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <User className="w-4 h-4"/>
                                                Your Profile
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <Settings className="w-4 h-4"/>
                                                Settings
                                            </button>
                                            <button
                                                type="button"
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                                <HelpCircle className="w-4 h-4"/>
                                                Help & Support
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 pt-1">
                                            <button
                                                onClick={logout}
                                                type="button"
                                                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                <LogOut className="w-4 h-4"/>
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-4 lg:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;