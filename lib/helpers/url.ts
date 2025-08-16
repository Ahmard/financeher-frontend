export const backendUrl = (uri?: string): string => {
    uri = (uri && uri.startsWith('/')) ? uri.substring(1) : uri;
	const prefix = process.env.NODE_ENV === 'development' ? '' : 'hydrogen/';
	return `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/${prefix}${uri}`;
};

export const authUrl = (uri?: string): string =>
	`${process.env.NEXT_PUBLIC_AUTH_API_BASE_URL}/${uri}`;

export const useUploadUrl = (uri?: string): string =>
	`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/${uri}`;

export const apiUrl = (uri?: string, params = {}): string => {
	const query = new URLSearchParams(params).toString();
	return backendUrl(
		`api/${process.env.NEXT_PUBLIC_BACKEND_API_VERSION}/${uri}?${query}`,
	);
};

export const apiAuthUrl = (uri?: string, params = {}): string => {
	const query = new URLSearchParams(params).toString();
	return authUrl(`api/v1/${uri}?${query}`);
};

export const useUrlFromRootDomain = (uri?: string): string =>
	`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${uri}`;

export const useWsUrl = (path: string) =>
	`${process.env.NEXT_PUBLIC_WEBSOCKET_SERVER}/${path}`;

export const useExampleUrl = (uri?: string, withProtocol = true): string => {
	const url = uri ? `/${uri}` : '';
	return `${withProtocol ? 'https://' : ''}example.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${url}`;
};

export const useEmailFromRootDomain = (email: string): string =>
	`${email}@${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`;
