import type * as React from 'react';
import { useEffect, useState } from 'react';
import type { IconType } from 'antd/es/notification/interface';
import { useNotify } from '@/lib/hooks/notify';
import type { NoticeType } from 'antd/es/message/interface';

export interface IMessage {
	type?: NoticeType;
	title?: string;
	message: string;
	html?: React.ReactNode;
	duration?: number;
	mode?: 'notification' | 'message';
}

export const useMessage = (title?: string) => {
	const { notify, loading } = useNotify();
	const appTitle = title ?? (process.env.NEXT_PUBLIC_APP_NAME as string);
	const [appMessage, setMessage] = useState({
		title: undefined as string | undefined,
		message: '',
		state: false,
		type: 'success' as IconType,
	});

	useEffect(() => {
		if (appMessage.state) {
			notify({
				mode: 'message',
				type: appMessage.type,
				message: appMessage.message,
				title: appMessage.title ?? appTitle,
			});
		}
	}, [appMessage, appTitle, notify]);

	const showMessage = (
		message: string | IMessage,
		type: IconType = 'success',
	) => {
		if (typeof message === 'string') {
			setMessage({
				type,
				message,
				state: true,
				title: undefined,
			});
		} else {
			setMessage({
				state: true,
				title: message.title,
				message: message.message,
				type: message.type as IconType,
			});
		}

		setTimeout(resetMessage, 100);
	};

	const resetMessage = () => {
		setMessage({
			message: '',
			state: false,
			title: undefined,
			type: 'success',
		});
	};

	return { showMessage, resetMessage, loading };
};
