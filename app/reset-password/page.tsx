'use client';

import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import AuthLayout from "@/components/App/Layouts/AuthLayout";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {usePageTitle} from "@/lib/helpers/page.helper";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {xhrPost} from "@/lib/xhr";
import {redirect, useSearchParams} from "next/navigation";

// Zod schema for form validation
const loginSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  password_confirmation: z.string().min(6, "Password confirmation must be at least 6 characters"),
});

type ForgotPwdFormData = z.infer<typeof loginSchema>;

export default function ResetPasswordPage() {
  usePageTitle('Reset Password');

  const token = useSearchParams().get('token')

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPwdFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [isLinkSent, setIsLinkSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {data: session} = useSession();
  const isLoggedIn = !!session;

  const {showMessage} = useMessage()

  // biome-ignore lint/correctness/useExhaustiveDependencies: true
  useEffect(() => {
    if (isLoggedIn) {
      showMessage({
        type: 'info',
        message: "You are already logged in",
      })

      setTimeout(() => redirect("/dashboard"), 500);
    }

    if (!token) {
      showMessage({
        type: 'warning',
        message: 'Invalid password reset token',
      })

      setTimeout(() => redirect("/login"), 500);
    }
  }, [isLoggedIn, token]);

  const onSubmit = async (data: ForgotPwdFormData) => {
    setIsSubmitting(true)

    try {
      const _resp = await xhrPost(apiUrl(`auth/password-reset/${token}/reset`), {
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      showMessage('Password changed successfully');

      setIsLinkSent(true)

      setTimeout(() => redirect('/login'), 500)
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <AuthLayout>
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <form className="md:w-96" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-right mb-8"></div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-semibold text-[#006A4B] mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-8">
                Change your password here. After saving, you'll be logged out.
              </p>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    readOnly={isSubmitting}
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password_confirmation" className="text-gray-700 font-medium">Confirm New Password</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    placeholder="******"
                    className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    readOnly={isSubmitting}
                    {...register('password_confirmation')}
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isLinkSent}
                className="cursor-pointer w-full mt-6 py-3 bg-[#006A4B] hover:bg-emerald-800 text-white font-medium"
              >
                {isSubmitting ? 'Saving' : 'Save'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                <Link href="/login" className="!text-[#006A4B] hover:underline font-bold ms-1">
                  Login
                </Link> to your account
              </p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
