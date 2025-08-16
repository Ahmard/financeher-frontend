import type {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type {FetchError} from 'ofetch';
import {COOKIE_NAMES, IS_DEBUG_ENABLED, IS_PRODUCTION,} from '@/lib/constants/app';
import {apiUrl} from '@/lib/helpers/url';
import type {AuthMe, AuthUserData, ILoginResponse} from '@/lib/types/auth';
import {xhrGet, xhrPost} from '@/lib/xhr';

export const authOptions: NextAuthOptions = {
    debug: IS_DEBUG_ENABLED,
    secret: process.env.NEXTAUTH_SECRET,

    useSecureCookies: IS_PRODUCTION,

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    cookies: {
        sessionToken: {
            name: COOKIE_NAMES.SESSION_TOKEN,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
            },
        },
        callbackUrl: {
            name: COOKIE_NAMES.CALLBACK_URL,
            options: {
                httpOnly: false, // Make this readable by client
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
            },
        },
        csrfToken: {
            name: COOKIE_NAMES.CSRF_TOKEN,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
            },
        },
        pkceCodeVerifier: {
            name: COOKIE_NAMES.PKCE_CODE_VERIFIER,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
                maxAge: 900,
            },
        },
        state: {
            name: COOKIE_NAMES.STATE,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
                maxAge: 900,
            },
        },
        nonce: {
            name: COOKIE_NAMES.NONCE,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: IS_PRODUCTION,
                maxAge: 900,
            },
        },
    },

    pages: {
        signIn: '/login',
    },

    providers: [
        CredentialsProvider({
            name: 'Login Token',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'Your Email',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                    placeholder: 'Your Password',
                },
            },
            async authorize(credentials) {
                try {
                    console.info(
                        '-----------------------Login Request ----------------------',
                    );

                    const resp = await xhrPost<ILoginResponse>(
                        apiUrl('auth/login'),
                        {
                            email: credentials?.email,
                            password: credentials?.password,
                        },
                        {},
                        {Authorization: ''},
                    );

                    console.log(
                        '-----------------------Login Response ----------------------',
                    );
                    console.log(resp.data);
                    console.log(
                        '-----------------------Login Response ----------------------',
                    );

                    const user_resp = await xhrGet<AuthMe>(
                        apiUrl('auth/me'),
                        {},
                        {
                            Authorization: `Bearer ${resp.data.access_token}`,
                        },
                    );

                    return {
                        ...user_resp.data,
                        device_id: resp.data.device_id,
                        biometric: resp.data.biometric,
                        access_token: resp.data.access_token,
                        access_token_expires_at: resp.data.expires_at,
                    };
                } catch (e) {
                    const error = <FetchError>e;
                    console.error(error);
                    throw new Error(JSON.stringify(error?.response?._data));
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.user = user;
            }

            return token;
        },
        async session({session, token}) {
            if (!token?.user?.access_token) return session;

            try {
                // Fetch fresh user data from your backend
                const user_resp = await xhrGet<AuthMe>(
                    apiUrl('auth/me'),
                    {},
                    {
                        Authorization: `Bearer ${token.user.access_token}`,
                    }
                );

                const updatedUser = {
                    ...token.user,
                    ...user_resp.data, // override fields with fresh ones
                };

                session.user = updatedUser as AuthUserData;
                session.accessToken = updatedUser.access_token;

                console.info('---------- User data refreshed from backend ------------')

                return session;
            } catch (error) {
                console.error('Error refreshing user data in session callback:', error);
                return session; // Fallback to existing session
            }
        },
        async redirect({url, baseUrl}) {
            // Make sure we're redirecting to the correct URL
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
};
