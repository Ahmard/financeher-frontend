import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {getServerSession} from "next-auth";
import type React from "react";
import {authOptions} from "@/lib/nextauth.option";
import {AntdProvider} from "@/providers/AntdProvider";
import {AuthProvider} from "@/providers/AuthProvider";
import ClientProvider from "@/providers/ClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

export const metadata: Metadata = {
  title: appName,
  description: "Access Everything, Effortlessly.",
  openGraph: {
    title: appName,
    description: "Access Everything, Effortlessly.",
    url: frontendUrl,
    siteName: appName,
    images: [
      {
        url: `${frontendUrl}/images/logo-258x258.png`,
        width: 258,
        height: 258,
        alt: `${appName} Logo`,
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: "Access Everything, Effortlessly.",
    creator: "@leasafric",
    images: [`${frontendUrl}/images/logo-258x258.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    ><AntdProvider>
      <ClientProvider session={session}>
        <AuthProvider>{children}</AuthProvider>
      </ClientProvider>
    </AntdProvider>
    </body>
    </html>
  );
}
