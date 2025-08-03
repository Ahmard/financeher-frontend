import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {apiUrl} from "@/lib/helpers/url";
import {xhrPost} from "@/lib/xhr";

// Zod schema for form validation
const signupSchema = z.object({
  full_name: z.string()
    .min(5, "Full name must be at least 5 characters long")
    .max(150, "Full name must be less than 150 characters long"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface IProps {
  onAccountCreated: (email: string, pass: string) => void,
}

export default function RegisterMainScreen(props: IProps) {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const {onAccountCreated} = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: SignupFormData) => {
    setIsSubmitting(true)
    xhrPost(apiUrl('auth/register'), data)
      .then(async () => {
        console.info('Account created successfully')
        onAccountCreated(data.email, data.password)
      })
      .finally(() => setIsSubmitting(false))
  };

  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-right mb-8">
            <Link href="/login" className="!text-[#006A4B] hover:!text-emerald-800 font-medium">
              Login
            </Link>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-semibold text-[#006A4B] mb-2">
              Create an account
            </h2>
            <p className="text-gray-600 mb-8">
              Enter your details below to create your account
            </p>

            <Button variant="outline" className="w-full mb-6 py-3 border-gray-300 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <title>Google</title>
                <path fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-gray-500 text-sm mb-6">
              OR CONTINUE WITH
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-gray-700 font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter Full Name"
                  className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  {...register('full_name')}
                  readOnly={isSubmitting}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Email Address"
                  className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  {...register('email')}
                  readOnly={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Password"
                  className="mt-1 py-3 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  readOnly={isSubmitting}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full mt-6 py-3 bg-green-900 hover:bg-emerald-800 text-white font-medium"
            >
              {isSubmitting ? 'Submitting' : 'Continue'}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-6">
              By Clicking continue, you agree to our{' '}
              <a href="#" className="text-emerald-700 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-emerald-700 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}