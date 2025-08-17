'use client';

import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {xhrPut} from "@/lib/xhr";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";

const changePasswordSchema = z.object({
    old_password: z.string().min(6, "Old password must be at least 6 characters"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function TabSecurity() {
    const {data: session} = useSession({required: true});
    const {showMessage} = useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        setIsSubmitting(true);

        try {
            await xhrPut(apiUrl('profile/password'), data);
            showMessage('Password updated successfully');
            reset(); // Clear form after success
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
                <p className="text-gray-600">Update your account password here.</p>
            </div>

            <div className="border border-b-1 my-4"></div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div>
                    <Label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                    </Label>
                    <Input
                        id="old_password"
                        type="password"
                        autoComplete="current-password"
                        {...register('old_password')}
                    />
                    {errors.old_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.old_password.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        {...register('password')}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                    </Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        {...register('password_confirmation')}
                    />
                    {errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
                    )}
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#006A4B] hover:bg-green-700 text-white px-6 rounded-2xl"
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                        ) : (
                            'Change Password'
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
