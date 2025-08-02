import { DateTime } from 'luxon';

export function formatDatetime(time: string) {
	const date = DateTime.fromISO(time);
	return date.toFormat('yyyy-MM-dd HH:mm:ss');
}
