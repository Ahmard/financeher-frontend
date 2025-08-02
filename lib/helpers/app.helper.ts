export const appName = (): string => {
	return process.env.NEXT_PUBLIC_APP_NAME ?? 'App';
};

export const makePageTitle = (title: string) => {
	return `${title} | ${process.env.NEXT_PUBLIC_APP_NAME}`;
};
