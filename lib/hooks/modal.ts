import { App, Modal } from 'antd';

interface IConfirm {
	title: string;
	content: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel?: () => void;
}

export function useModal() {
	const { modal } = App.useApp();

	const confirm = (param: IConfirm) => {
		modal.confirm({
			title: param.title,
			content: param.content,
			okText: param.confirmText || 'Yes',
			cancelText: param.cancelText || 'No',
			onOk: param.onConfirm,
			onCancel: param.onCancel,
		});
	};

	return { confirm };
}
