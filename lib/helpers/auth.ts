import { isBrowser } from '@/lib/helpers/dom';

const BEARER_TOKEN_FIELD = `${process.env.NEXT_PUBLIC_APP_CODE}.bearer.token`;

export const prepareLoggedAccount = (token: string) => {
	setBearerToken(token)
};

export const getBearerToken = (): string | null => {
	if (!isBrowser()) return null;
	return localStorage.getItem(BEARER_TOKEN_FIELD);
};

export const setBearerToken = (token: string) => {
	if (!isBrowser()) return;
	localStorage.setItem(BEARER_TOKEN_FIELD, token);
};

export const clearBearerToken = () => {
	if (!isBrowser()) return;
	localStorage.removeItem(BEARER_TOKEN_FIELD);
};
