export type TimeComponentsLong = {
	By?: number;
	My?: number;
	millennia?: number;
	centuries?: number;
	years?: number;
	months?: number;
	weeks?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
	microseconds?: number;
	nanoseconds?: number;
	picoseconds?: number;
};
export type TimeComponentsShort = {
	By?: number;
	My?: number;
	ky?: number;
	c?: number;
	Y?: number;
	M?: number;
	W?: number;
	D?: number;
	h?: number;
	m?: number;
	s?: number;
	ms?: number;
	µs?: number;
	ns?: number;
	ps?: number;
};
export type TimeComponents = Merge<TimeComponentsShort | TimeComponentsLong>;

// https://dev.to/lucianbc/union-type-merging-in-typescript-9al
type Merge<T extends Record<string, unknown>> = {
	[k in AllKeys<T>]: PickType<T, k>;
};
type AllKeys<T> = T extends any ? keyof T : never;
type PickType<T, K extends AllKeys<T>> = T extends {[k in K]?: any}
	? T[K]
	: undefined;

/**
Parse milliseconds into an object.

@example
```
import parseMilliseconds from 'parse-ms';

parseMilliseconds(1337000001);
// {
// 	days: 15,
// 	hours: 11,
// 	minutes: 23,
// 	seconds: 20,
// 	milliseconds: 1,
// 	microseconds: 0,
// 	nanoseconds: 0
// }
```
 */
export default function parseMilliseconds(milliseconds: number, options?: Options): TimeComponents;
export type Options = {
	/**
   The highest TimeUnit you want in your return object.
   Can be a long string like 'days' or a short string like 'd'
   See type TimeUnits for full list.

   @default 'days'
   */
	readonly upToUnit?: TimeUnits;// Keyof typeof TimeUnits;
	/**
   The lowest TimeUnit you want in your return object.
   Can be a long string like 'days' or a short string like 'd'
   See type TimeUnits for full list.

   @default 'nanoseconds'
   */
	readonly downToUnit?: TimeUnits;
	/**
   Choose parseMilliseconds return format with a string enum 'short' | 'long' | 'both' :
   - with 'long', parseMilliseconds will return an object with 'long' keys {days, hours, minutes, seconds...}
   - with 'short' it will return {d, h, m, s...}
   - with 'both' it will return {d, days, h, hours...}

   @default 'long'
   */
	readonly outputFormat?: 'short' | 'long' | 'both';
};
export enum TimeUnits {
	millennia = 'millennia',
	centuries = 'centuries',
	years = 'years',
	months = 'months',
	weeks = 'weeks',
	days = 'days',
	hours = 'hours',
	minutes = 'minutes',
	seconds = 'seconds',
	milliseconds = 'milliseconds',
	microseconds = 'microseconds',
	nanoseconds = 'nanoseconds',
	picoseconds = 'picoseconds',
	By = 'By',
	My = 'My',
	ky = 'ky',
	c = 'c',
	Y = 'Y',
	M = 'M',
	W = 'W',
	D = 'D',
	h = 'h',
	m = 'm',
	s = 's',
	ms = 'ms',
	µs = 'µs',
	ns = 'ns',
	ps = 'ps',
}
