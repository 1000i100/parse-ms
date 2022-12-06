export type TimeComponentsLong = {
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
export type TimeComponents = Merge<TimeComponentsShort|TimeComponentsLong>;

// https://dev.to/lucianbc/union-type-merging-in-typescript-9al
type Merge<T extends object> = {
  [k in AllKeys<T>]: PickType<T, k>;
};
type AllKeys<T> = T extends any ? keyof T : never;
type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
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
export default function parseMilliseconds(milliseconds: number, options?: parseMillisecondsOptions): TimeComponents;
export type parseMillisecondsOptions = {
  upToUnit?: TimeUnits;// keyof typeof TimeUnits;
  downToUnit?: TimeUnits;
  outputFormat?: 'short' | 'long' | 'both';
};
export enum TimeUnits {
  millennia = "millennia",
  centuries = "centuries",
  years = "years",
  months = "months",
  weeks = "weeks",
  days = "days",
  hours = "hours",
  minutes = "minutes",
  seconds = "seconds",
  milliseconds = "milliseconds",
  microseconds = "microseconds",
  nanoseconds = "nanoseconds",
  picoseconds = "picoseconds",
  ky = "ky",
  c = "c",
  Y = "Y",
  M = "M",
  W = "W",
  D = "D",
  h = "h",
  m = "m",
  s = "s",
  ms = "ms",
  µs = "µs",
  ns = "ns",
  ps = "ps",
}
