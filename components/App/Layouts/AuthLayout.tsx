'use client';

import {CornerLeftUpIcon} from "lucide-react";
import Image from "next/image";
import type React from "react";
import Link from "next/link";

interface IProps {
  children: React.ReactNode;
}

export default function AuthLayout({children}: IProps) {

  return (
    <div className="min-h-screen flex">
      {/* ...left side remains unchanged... */}
      <div className="hidden md:flex md:flex-1 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/financeher-side.png')`
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
                <Image width={200} height={200} src="/images/financeher-white.png" alt="logo"/>
              </div>
            </div>

            <h1 className="text-[16px] font-medium mb-4 leading-relaxed">
              Discover curated funding opportunities specifically designed for female founders and women-led businesses.
            </h1>

            {/* Return to homepage link */}
            <Link href="/">
              <button
                type="button"
                className="cursor-pointer flex items-center space-x-2 text-white/90 hover:text-white transition-colors">
                <CornerLeftUpIcon/>
                <span className="text-sm">Return to Homepage</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      {children}
    </div>
  );
}
