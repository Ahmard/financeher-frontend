import { useEffect } from 'react';
import { isBrowser } from '@/lib/helpers/dom';
import { makePageTitle } from '@/lib/helpers/app.helper';

export const usePageTitle = (title: string) => {
	useEffect(() => setPageTitle(title));
};

export const setPageTitle = (title: string) => {
	if (!isBrowser()) return;

	const pageTitle = makePageTitle(title);

	console.info(pageTitle);

	document.title = pageTitle;
};
