export function isBrowser() {
	return !!(
		typeof window !== 'undefined' &&
		window.document &&
		window.document.createElement
	);
}

export function isMobileView() {
	if (!isBrowser()) return false;
	return window.innerWidth <= 768;
}
