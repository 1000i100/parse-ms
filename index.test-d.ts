import {expectType} from 'tsd';
import parseMilliseconds, {type TimeComponents} from './index.js';

const components: TimeComponents = parseMilliseconds(3000);

expectType<number | undefined>(components.days);
expectType<number | undefined>(components.hours);
expectType<number | undefined>(components.minutes);
expectType<number | undefined>(components.seconds);
expectType<number | undefined>(components.milliseconds);
expectType<number | undefined>(components.microseconds);
expectType<number | undefined>(components.nanoseconds);
