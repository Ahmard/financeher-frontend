export function ucFirst(string: string): string {
	if ('string' !== typeof string) {
		return '';
	}

	return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export function ucWords(string: string) {
	return string
		.toLowerCase()
		.split(' ')
		.map((value) => ucFirst(value))
		.join(' ');
}

export function prettyWords(string: string) {
	return ucWords(string.replaceAll('_', ' '));
}

let cmkCounter = 0;
export function cmk(item?: string): string {
	const prefix = item?.length ? item : 'rand';
	return `${prefix}-${Date.now()}-${cmkCounter++}`;
}

export function formatFileSize(bytes: number, decimalPoint = 2): string {
	if (bytes === 0) return '0 Bytes';
	const k = 1000;
	const dm = decimalPoint || 2;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function decodeHtml(html: string) {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
}

export function colorText(text: string, color: string) {
	return `<span class="text-${color}">${text}</span>`;
}

export function convertToString(val: string | number | null | undefined) {
	return val ? val.toString() : '';
}

export function isEmpty(value: unknown): boolean {
	return !value || !value.toString().length;
}

export function nl2br(str: string) {
	return str.replaceAll(/\n/g, '<br />');
}

/**
 * Encodes a string to Base64 format.
 * @param input - The string to encode.
 * @returns The Base64 encoded string.
 */
export function base64_encode(input: string): string {
	return btoa(unescape(encodeURIComponent(input)));
}

/**
 * Decodes a Base64 encoded string.
 * @param input - The Base64 string to decode.
 * @returns The decoded string.
 */
export function base64_decode(input: string): string {
	return decodeURIComponent(escape(atob(input)));
}
