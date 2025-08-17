import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {xhrPut} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {useSession} from "next-auth/react";
import {AuthUserData} from "@/lib/types/auth";
import {Loader2} from "lucide-react";

const TabNotification = () => {
    const {showMessage} = useMessage()

    const {data: session} = useSession({required: true});
    const user: AuthUserData = session?.user;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [notifications, setNotifications] = useState({
        is_news_notification_enabled: user?.is_news_notification_enabled,
        is_new_opportunity_notification_enabled: user?.is_new_opportunity_notification_enabled,
        is_app_opportunity_notification_enabled: user?.is_app_opportunity_notification_enabled,
    });

    console.log(notifications)

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleUpdateNotifications = async () => {
        setIsSubmitting(true)

        try {
            await xhrPut(apiUrl('profile/notification-settings'), notifications);
            showMessage('Notification settings updated successfully');
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Notifications</h1>
                <p className="text-gray-600">Configure how you receive notifications</p>
            </div>

            <div className="border border-b-1 my-4"></div>

            {/* Notifications Section */}
            <div className="">
                <div className="space-y-6">
                    {/* News and Updates */}
                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">News and Updates</h3>
                            <p className="text-sm text-gray-600">Get the latest news about products and features.</p>
                        </div>
                        <Switch
                            checked={notifications.is_news_notification_enabled}
                            onCheckedChange={(checked) => handleNotificationChange('is_news_notification_enabled', checked)}
                            className="ml-4 data-[state=checked]:bg-[#006A4B]"
                        />
                    </div>

                    {/* New opportunities Matches */}
                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">New opportunities Matches</h3>
                            <p className="text-sm text-gray-600">Get notified when new grants align with your profile.</p>
                        </div>
                        <Switch
                            checked={notifications.is_new_opportunity_notification_enabled}
                            onCheckedChange={(checked) => handleNotificationChange('is_new_opportunity_notification_enabled', checked)}
                            className="ml-4 data-[state=checked]:bg-[#006A4B]"
                        />
                    </div>

                    {/* Application Opportunities Reminders */}
                    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900 mb-1">Application Opportunities Reminders</h3>
                            <p className="text-sm text-gray-600">Stay on track with timely deadline alerts.</p>
                        </div>
                        <Switch
                            checked={notifications.is_app_opportunity_notification_enabled}
                            onCheckedChange={(checked) => handleNotificationChange('is_app_opportunity_notification_enabled', checked)}
                            className="ml-4 data-[state=checked]:bg-[#006A4B]"
                        />
                    </div>
                </div>

                {/* Update Button */}
                <div className="mt-6">
                    <Button
                        disabled={isSubmitting}
                        onClick={handleUpdateNotifications}
                        className="bg-[#214F47] hover:bg-green-700 text-white px-6 py-4 rounded-2xl font-medium"
                    >
                        {isSubmitting
                            ? (<Loader2 className="h-4 w-4 text-white animate-spin"/>)
                            : 'Update notifications'
                        }
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TabNotification;