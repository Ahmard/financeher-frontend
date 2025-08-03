import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {getSession, signIn} from "next-auth/react";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {prepareLoggedAccount} from "@/lib/helpers/auth";
import {apiUrl} from "@/lib/helpers/url";
import {useMessage} from "@/lib/hooks/message";
import {xhrPost} from "@/lib/xhr";
import {redirect} from "next/navigation";

const verificationSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof verificationSchema>;

interface IRegisterResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
}

interface IProps {
  email: string;
  password: string;
  onAccountVerified: () => void,
}

export default function RegisterEmailVerificationScreen(props: IProps) {
  const {handleSubmit, control} = useForm<SignupFormData>({
    resolver: zodResolver(verificationSchema),
  });
  const {email, password, onAccountVerified} = props;

  const {showMessage} = useMessage()

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data: SignupFormData) => {
    setIsSubmitting(true)
    xhrPost<IRegisterResponse>(apiUrl(`auth/register/${data.code}/verify-code`), data)
      .then(async (_) => {
        console.info('Account verified successfully')

        // Try login user in
        const _login_response = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
        });

        const session = await getSession({})
        if (!session) {
          showMessage({
            type: 'error',
            message: 'Something went wrong while preparing your account, please contact support',
            duration: 30
          });

          return;
        }

        prepareLoggedAccount(session.accessToken);
        showMessage('Account verified successfully')

        onAccountVerified()

        setTimeout(() => redirect('/account-setup'), 500)
      })
      .finally(() => setIsSubmitting(false))
  };

  return (
    <div className="flex-1 bg-white flex items-center justify-center p-8">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-right mb-8">
            <Link href="/login" className="!text-green-900 hover:!text-emerald-800 font-medium">
              Login
            </Link>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl font-semibold text-[#006A4B] mb-2">
              Create an account
            </h2>
            <p className="text-gray-600 mb-8">
              We sent temporary login code to <b>{email}</b>
            </p>


            {/* Form Fields */}
            <div className="space-y-4">
              <Controller
                name="code"
                control={control}
                defaultValue=""
                render={({field, fieldState}) => (
                  <div className="flex flex-col items-center">
                    <InputOTP
                      value={field.value}
                      onChange={field.onChange}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0}/>
                        <InputOTPSlot index={1}/>
                        <InputOTPSlot index={2}/>
                        <InputOTPSlot index={3}/>
                        <InputOTPSlot index={4}/>
                        <InputOTPSlot index={5}/>
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.error && (
                      <p className="text-sm text-red-600 mt-2">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
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