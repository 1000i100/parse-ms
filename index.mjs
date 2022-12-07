const weekByMonth = 365.25 / 7 / 12;

const factors = [
	{shortUnit: 'ps', unit: 'picoseconds', modulo: 1000, factor: 1e-9},
	{shortUnit: 'ns', unit: 'nanoseconds', modulo: 1000, factor: 1e-6},
	{shortUnit: 'µs', unit: 'microseconds', modulo: 1000},
	{shortUnit: 'ms', unit: 'milliseconds', modulo: 1000},
	{shortUnit: 's', unit: 'seconds', modulo: 60},
	{shortUnit: 'm', unit: 'minutes', modulo: 60},
	{shortUnit: 'h', unit: 'hours', modulo: 24},
	{shortUnit: 'D', unit: 'days', modulo: 7},
	{shortUnit: 'W', unit: 'weeks', modulo: weekByMonth},
	{shortUnit: 'M', unit: 'months', modulo: 12},
	{shortUnit: 'Y', unit: 'years', modulo: 100},
	{shortUnit: 'c', unit: 'centuries', modulo: 10},
	{shortUnit: 'ky', unit: 'millennia', modulo: 999_999_999_999_999},
];
for (let i = 1; i < factors.length; i++) {
	factors[i].factor = factors[i - 1].factor * factors[i - 1].modulo;
	if (factors[i - 1].factor >= 1) {
		factors[i - 1].factor = Math.trunc(factors[i - 1].factor);
	}

	// Factors[i].modulo = Math.ceil(factors[i].modulo);
}

const lastFactor = factors[factors.length - 1];
if (lastFactor.factor >= 1) {
	lastFactor.factor = Math.trunc(lastFactor.factor);
}

factors.reverse();

const toLongUnit = {};
for (const f of factors) {
	toLongUnit[f.unit] = f.unit;
	toLongUnit[f.shortUnit] = f.unit;
}

const toShortUnit = {};
for (const f of factors) {
	toShortUnit[f.unit] = f.shortUnit;
	toShortUnit[f.shortUnit] = f.shortUnit;
}

export default function parseMilliseconds(milliseconds, options = {}) {
	if (typeof milliseconds !== 'number') {
		throw new TypeError(`Expected a number, received : ${milliseconds}`);
	}

	if (!options.upToUnit) {
		options.upToUnit = 'days';
	}

	if (!options.downToUnit) {
		options.downToUnit = 'nanoseconds';
	}

	if (!options.outputFormat) {
		options.outputFormat = 'long';
	}

	if (toLongUnit[options.upToUnit]) {
		options.upToUnit = toLongUnit[options.upToUnit];
	} else {
		throw new TypeError(`Unknown unit : ${options.upToUnit} (known : ${toShortUnit.join(', ')}, ${toLongUnit.join(', ')}`);
	}

	if (toLongUnit[options.downToUnit]) {
		options.downToUnit = toLongUnit[options.downToUnit];
	} else {
		throw new TypeError(`Unknown unit : ${options.downToUnit} (known : ${toShortUnit.join(', ')}, ${toLongUnit.join(', ')}`);
	}

	let intPower = 0;
	while (!Number.isInteger(milliseconds * (10 ** intPower))) {
		intPower++;
	}

	milliseconds *= 10 ** intPower;

	const result = {};
	let convertToThisUnit = false;
	for (const u of factors) {
		if (u.unit === options.upToUnit) {
			convertToThisUnit = true;
		}

		if (!convertToThisUnit) {
			continue;
		}

		if (u.unit === options.downToUnit) {
			result[u.unit] = Math.round(milliseconds / u.factor / (10 ** intPower));
			fixRoundCascading(result, options.upToUnit);

			return chooseNameFormat(result, options.outputFormat);
		}

		result[u.unit] = Math.trunc(milliseconds / u.factor / (10 ** intPower));
		if (result[u.unit]) {
			milliseconds -= result[u.unit] * u.factor * (10 ** intPower);
		}
	}
}

function chooseNameFormat(result, format) {
	switch (format) {
		case 'long': {
			return result;
		}

		case 'short': {
			return convertToShort(result);
		}

		case 'both': {
			return {...convertToShort(result), ...result};
		}

		default: {
			throw new TypeError(`output format "${format}" unknown. Choose between "short", "long" or "both".`);
		}
	}
}

function convertToShort(result) {
	const shortFormat = {};
	for (const k of Object.keys(result)) {
		shortFormat[toShortUnit[k]] = result[k];
	}

	return shortFormat;
}

function fixRoundCascading(result, upToUnit) {
	for (let asc = factors.length - 1; asc >= 0; asc--) {
		const a = factors[asc];
		if (a.unit === upToUnit) {
			break;
		}

		if (result[a.unit] < 0) {
			if (result[a.unit] <= -a.modulo) {
				result[a.unit] += a.modulo;
				result[factors[asc - 1].unit]--;
			}
		} else if (result[a.unit] >= a.modulo) {
			result[a.unit] -= a.modulo;
			result[factors[asc - 1].unit]++;
		}
	}
}
