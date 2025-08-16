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
import {redirect} from "next/navigation";

// Zod schema for form validation
const loginSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPwdFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  usePageTitle('Forgot Password');

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

      // setTimeout(() => redirect("/"), 50);
    }
  }, [isLoggedIn]);

  const onSubmit = async (data: ForgotPwdFormData) => {
    setIsSubmitting(true)

    try {
      const _resp = await xhrPost(apiUrl('auth/password-reset'), {
        email: data.email,
      });

      showMessage('Password reset link set successfully');

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
                Forgot Password
              </h2>
              <p className="text-gray-600 mb-8">
                Please enter the email address you registered with Financeher
                below and we'll email you a link to a page where you can easily create a new password.
              </p>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Email Address"
                    className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    {...register('email')}
                    readOnly={isSubmitting || isLinkSent}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || isLinkSent}
                className="cursor-pointer w-full mt-6 py-3 bg-[#006A4B] hover:bg-emerald-800 text-white font-medium"
              >
                {isSubmitting ? 'Submitting' : 'Continue'}
              </Button>

              <p className="text-center text-sm text-gray-600 mt-6">
                <Link href="/login" className="!text-[#006A4B] hover:underline font-bold ms-1">
                  Return back to login
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
