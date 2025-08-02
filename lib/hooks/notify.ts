import { ucFirst } from '@/lib/helpers/str';
import { App, message, notification } from 'antd';
import type { JointContent, NoticeType } from 'antd/es/message/interface';
import type { IconType } from 'antd/es/notification/interface';
import type * as React from 'react';
import { isBrowser, isMobileView } from '../helpers/dom';
import type { MessageType } from 'antd/lib/message/interface';

export const useNotify = () => {
	const is_browser = isBrowser();
	const is_mobile_view = isMobileView();
	const { message, notification } = App.useApp();

	const notify = (ctn: NotificationContent) => {
		if (is_browser) {
			if (is_mobile_view || ctn.mode === 'message') {
				message.open({
					type: ctn.type,
					content: ctn.message ?? get_v_node(ctn.html),
					duration: ctn.duration,
				});
			} else {
				notification.open({
					type: ctn.type as IconType,
					message: ctn.title,
					description: ctn.message ? ucFirst(ctn.message) : ctn.html,
					duration: ctn.duration ?? 15,
				});
			}
		}
	};

	const notifySuccess = (ctn: NotificationContent) => {
		notify({ ...ctn, type: 'success' });
	};

	const notifyInfo = (ctn: NotificationContent) => {
		notify({ ...ctn, type: 'info' });
	};

	const notifyWarning = (ctn: NotificationContent) => {
		notify({ ...ctn, type: 'warning' });
	};

	const notifyError = (ctn: NotificationContent) => {
		notify({ ...ctn, type: 'error' });
	};

	const loading = (
		msg: JointContent,
		duration: number | VoidFunction = 10,
	): MessageType => {
		return message.loading(msg, duration);
	};

	return {
		notify,
		notifySuccess,
		notifyInfo,
		notifyWarning,
		notifyError,
		loading,
	};
};

export const notify = (ctn: NotificationContent) => {
	if (isBrowser()) {
		if (isMobileView()) {
			message.open({
				type: ctn.type,
				content: ctn.message ?? get_v_node(ctn.html),
				duration: ctn.duration,
			});
		} else {
			notification.open({
				type: ctn.type as IconType,
				message: ctn.title,
				description: ctn.message ? ucFirst(ctn.message) : ctn.html,
				duration: ctn.duration ?? 15,
			});
		}
	}
};

const get_v_node = (v_node: React.ReactNode | (() => React.ReactNode)) => {
	if (typeof v_node === 'function') {
		return v_node();
	}

	return v_node;
};

export interface NotificationContent {
	type?: NoticeType;
	title: string;
	message?: string;
	html?: React.ReactNode;
	duration?: number;
	mode?: 'notification' | 'message';
}
