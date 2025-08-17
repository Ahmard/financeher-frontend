'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {Bell, Shield, User, UserCog2Icon} from 'lucide-react';

import TabProfile from "@/components/App/Setting/TabProfile";
import PageHeader from "@/components/Common/PageHeader";
import TabSecurity from "@/components/App/Setting/TabSecurity";
import AdminLayout, {CurrentPage} from "@/components/App/Layouts/AdminLayout";
import TabAdminTable from "@/components/App/Admin/Setting/TabAdminTable";
import {ucWords} from "@/lib/helpers/str";
import {usePageTitle} from "@/lib/helpers/page.helper";
import TabNotification from "@/components/App/Setting/TabNotification";

export default function AdminSettingPage() {
    usePageTitle('Settings');

    const router = useRouter();
    const searchParams = useSearchParams();

    const tabParam = searchParams.get('tab');
    const validTabs = ['Profile', 'Security', 'User Access', 'Notifications'];
    const defaultTab = 'Profile';

    // Capitalize the first letter of `tabParam` if needed
    const formattedTabParam = tabParam
        ? ucWords(tabParam.replaceAll('-', ' '))
        : null;

    const initialTab = validTabs.includes(formattedTabParam || '') ? formattedTabParam! : defaultTab;
    const [activeSection, setActiveSection] = useState<string>(initialTab);

    useEffect(() => {
        // Sync active tab if query param changes (like back/forward button)
        if (formattedTabParam && formattedTabParam !== activeSection && validTabs.includes(formattedTabParam)) {
            setActiveSection(formattedTabParam);
        }
    }, [formattedTabParam]);

    const handleTabClick = (tabName: string) => {
        setActiveSection(tabName);

        // Lowercase and remove spaces for URL
        const paramValue = tabName.toLowerCase().replace(/\s+/g, '-');
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', paramValue);
        router.push(`/admin/settings?${params.toString()}`);
    };

    const sidebarItems = [
        {name: 'Profile', icon: User},
        {name: 'Security', icon: Shield},
        {name: 'User Access', icon: UserCog2Icon},
        {name: 'Notifications', icon: Bell},
    ];

    return (
        <AdminLayout currentPage={CurrentPage.Settings}>
            <PageHeader
                title="Settings"
                subtitle="Take full control of your account, preferences, and workflow to streamline your grant application process."
                withBottomBoarder={true}
            />

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
                                        onClick={() => handleTabClick(item.name)}
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
                <div className="flex-1 ps-8">
                    <div className="max-w-4xl">
                        {activeSection === 'Profile' && (<TabProfile/>)}
                        {activeSection === 'Security' && (<TabSecurity/>)}
                        {activeSection === 'User Access' && (<TabAdminTable/>)}
                        {activeSection === 'Notifications' && (<TabNotification/>)}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
