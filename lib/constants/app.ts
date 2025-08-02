export const IS_DEBUG_ENABLED = process.env.DEBUG === 'true';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

export const COOKIE_NAMES = {
	SESSION_TOKEN: `${process.env.NEXT_PUBLIC_APP_CODE}.session-token`,
	CALLBACK_URL: `${process.env.NEXT_PUBLIC_APP_CODE}.callback-url`,
	CSRF_TOKEN: `${process.env.NEXT_PUBLIC_APP_CODE}.csrf-token`,
	PKCE_CODE_VERIFIER: `${process.env.NEXT_PUBLIC_APP_CODE}.pkce-code-verifier`,
	STATE: `${process.env.NEXT_PUBLIC_APP_CODE}.state`,
	NONCE: `${process.env.NEXT_PUBLIC_APP_CODE}.nonce`,
};
