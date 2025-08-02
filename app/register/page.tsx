'use client';

import Image from "next/image";
import RegisterMainScreen from "@/components/App/Auth/RegisterMainScreen";
import {usePageTitle} from "@/lib/helpers/page.helper";

export default function SignupPage() {
  usePageTitle('Register');

  return (
    <div className="min-h-screen flex">
      {/* ...left side remains unchanged... */}
      <div className="flex-1  relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/financeher-side.png')`
          }}
        ></div>

        {/* Woman silhouette/image placeholder */}
        <div className="absolute right-0 bottom-0 w-80 h-96 opacity-20">
          <div className="w-full h-full bg-gradient-to-t from-black/30 to-transparent rounded-tl-full"></div>
        </div>

        {/* Green gradient overlay from center to bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-green-800"></div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10 p-8 flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2"></div>

          {/* Main content */}
          <div className="text-white max-w-md">
            {/* Logo above the statement */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="rounded-full flex items-center justify-center">
                <Image width={200} height={200} src="/financeher-white.png" alt="logo"/>
              </div>
            </div>

            <h1 className="text-[16px] font-medium mb-4 leading-relaxed">
              Discover curated funding opportunities specifically designed for female founders and women-led businesses.
            </h1>

            {/* Return to homepage link */}
            <button type="button"
                    className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Icon</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span className="text-sm">Return to Homepage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <RegisterMainScreen />
    </div>
  );
}
