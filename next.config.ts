import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },

    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXT_PUBLIC_APP_CODE: process.env.NEXT_PUBLIC_APP_CODE,
        NEXT_PUBLIC_AUTH_FRONTEND_SERVER: process.env.NEXT_PUBLIC_AUTH_FRONTEND_SERVER,
        NEXT_PUBLIC_BACKEND_API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL,
    },

    images: {
        remotePatterns: [new URL(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/**`)],
    },
};

export default nextConfig;
