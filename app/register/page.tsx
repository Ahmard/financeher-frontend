'use client';

import {useState} from "react";
import RegisterEmailVerificationScreen from "@/components/App/Auth/RegisterEmailVerificationScreen";
import RegisterMainScreen from "@/components/App/Auth/RegisterMainScreen";
import AuthLayout from "@/components/App/Layouts/AuthLayout";
import {usePageTitle} from "@/lib/helpers/page.helper";

export default function SignupPage() {
  usePageTitle('Register');

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const onAccountCreated = (email: string, pass: string) => {
    setEmail(email)
    setPassword(pass)
  };

  const onAccountVerified = () => {

  };

  return (
    <AuthLayout>
      {!email && (
        <RegisterMainScreen onAccountCreated={onAccountCreated}/>
      )}

      {email && password && (
        <RegisterEmailVerificationScreen
          email={email}
          password={password}
          onAccountVerified={onAccountVerified}
        />
      )}
    </AuthLayout>
  );
}
