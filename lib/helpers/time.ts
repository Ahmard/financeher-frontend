import {DateTime} from 'luxon';

export function formatDatetime(time: string) {
    const date = DateTime.fromISO(time);
    return date.toFormat('yyyy-MM-dd HH:mm:ss');
}

export function greet(name: string) {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
        return `Good morning, ${name}`;
    } else if (hour < 18) {
        return `Good afternoon, ${name}`;
    } else {
        return `Good evening, ${name}`;
    }
}

export function greetingIcon() {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
        return "🌻";
    } else if (hour < 18) {
        return "☀️";
    } else {
        return "🌙";
    }
}