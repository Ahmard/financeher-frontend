'use client';

import type { NoticeType } from 'antd/lib/message/interface';

export interface IFlashMessage {
	title?: string;
	message: string;
	type: NoticeType;
}

export const setCallbackUrl = (url: string) => {
	sessionStorage.setItem('callback.url', url);
};

export const setFlashMessage = (m: IFlashMessage) => {
	sessionStorage.setItem('flash.message', JSON.stringify(m));
};

export const getCallbackUrl = (def: string): string => {
	const url = sessionStorage.getItem('callback.url');
	sessionStorage.removeItem('callback.url');
	return url ?? def ?? null;
};

export const getFlashMessage = (): IFlashMessage | null => {
	const message = sessionStorage.getItem('flash.message');
	sessionStorage.removeItem('flash.message');
	return message ? JSON.parse(message) : null;
};
