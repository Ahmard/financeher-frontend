export function formatNumber(number: number, minFractionDigits = 2) {
	return Intl.NumberFormat('en-NG', {
		minimumFractionDigits: minFractionDigits,
	}).format(number);
}

export function formatMoneyAmount(
	number: number,
	minFractionDigits = 2,
	currencyCode = 'NGN',
) {
	if ('NGN' === currencyCode) {
		return `&#8358;${formatNumber(number, minFractionDigits)}`;
	}

	return new Intl.NumberFormat('en-NG', {
		currency: currencyCode,
		style: 'currency',
		minimumFractionDigits: minFractionDigits,
	}).format(number);
}

export function formatMoneyAmountDisplay(
	num: number | string | null,
	nairaSign = false,
) {
	if (num === null) return 0;

	let localNum = num;

	localNum = localNum.toString().replace(/[^0-9.]/g, '') as unknown as number;

	if (localNum < 1000) {
		return localNum;
	}

	const si = [
		{ v: 1e3, s: 'K' },
		{ v: 1e6, s: 'M' },
		{ v: 1e9, s: 'B' },
		{ v: 1e12, s: 'T' },
		{ v: 1e15, s: 'P' },
		{ v: 1e18, s: 'E' },
	];

	let index: number;
	for (index = si.length - 1; index > 0; index--) {
		if (localNum >= si[index].v) {
			break;
		}
	}

	const formatted =
		(localNum / si[index].v)
			.toFixed(2)
			.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[index].s;

	if (nairaSign) {
		const amount = formatted.slice(0, -1);
		const unit = formatted.slice(formatted.length - 2, 1);

		return formatMoneyAmount(Number.parseInt(amount));
	}

	return formatted;
}
