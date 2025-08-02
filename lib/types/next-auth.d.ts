import type { AuthUserData } from '@/lib/types/auth';

declare module 'next-auth' {
	interface Session {
		accessToken: string;
		user: {
			id: string;
		} & Session['user'] &
			AuthUserData;
	}

	interface User extends AuthUserData {
		access_token: string;
		access_token_expires_at: number;
	}

	interface JWT {
		access_token: string;
	}
}
