import { formatMsAsDuration } from "./formatMsAsDuration.js";
import { expect } from '@codejamboree/js-test';

export const microsecond = () => {
  expect(formatMsAsDuration(0.001)).is('1\u00B5s');
}
export const ms = () => {
  expect(formatMsAsDuration(1)).is('0.001s');
}
export const second = () => {
  expect(formatMsAsDuration(1000)).is('1s');
}
export const minute = () => {
  expect(formatMsAsDuration(60000)).is('1m:00s');
}
export const hour = () => {
  expect(formatMsAsDuration(3600000)).is('1h:00m:00s');
}
export const day = () => {
  expect(formatMsAsDuration(86400000)).is('1d:00h:00m');
}
export const week = () => {
  expect(formatMsAsDuration(604800000)).is('7d:00h:00m');
}
export const month = () => {
  expect(formatMsAsDuration(2629746000)).is('1m:00d:00h');
}
export const year = () => {
  expect(formatMsAsDuration(31556952000)).is('1y:00m:00d');
}
export const negativeYear = () => {
  expect(formatMsAsDuration(-31556952000)).is('-1y:00m:00d');
}
export const undefinedValue = () => {
  expect(formatMsAsDuration(undefined)).is(undefined);
}
export const nullValue = () => {
  expect(formatMsAsDuration(null)).is(undefined);
}
export const numericString = () => {
  expect(formatMsAsDuration('1234567890')).is('14d:06h:56m');
}
export const floatString = () => {
  expect(formatMsAsDuration('12345.67890')).is('12.345s:678\u00B5s');
}
export const fewMillenia = () => {
  expect(formatMsAsDuration(123456789012345)).is('3,912y:02m:08d');
}
export const fewCenturies = () => {
  expect(formatMsAsDuration(12345678901234)).is('391y:02m:19d');
}
export const fewDecades = () => {
  expect(formatMsAsDuration(1234567890123)).is('39y:01m:14d');
}
export const fewYears = () => {
  expect(formatMsAsDuration(123456789012)).is('3y:10m:28d');
}
export const fewMonths = () => {
  expect(formatMsAsDuration(12345678901)).is('4m:21d:03h');
}
export const overADay = () => {
  expect(formatMsAsDuration(123456789)).is('1d:10h:17m');
}
export const fewHours = () => {
  expect(formatMsAsDuration(12345678)).is('3h:25m:45s');
}
export const fewMinutes = () => {
  expect(formatMsAsDuration(1234567)).is('20m:34.567s');
}
export const fewSeconds = () => {
  expect(formatMsAsDuration(3234.567)).is('3.234s:567\u00B5s');
}
export const fewMilliseconds = () => {
  expect(formatMsAsDuration(3.234567)).is('0.003s:234\u00B5s:567ns');
}
export const fewMicroseconds = () => {
  expect(formatMsAsDuration(.003234567)).is('3\u00B5s:234ns:566ps');
}
export const fewNanoseconds = () => {
  expect(formatMsAsDuration(.000003234567)).is('3ns:234ps:566fs');
}
export const fewPicoseconds = () => {
  expect(formatMsAsDuration(.000000003234567)).is('3ps:234fs:566as');
}
export const fewFemtoseconds = () => {
  expect(formatMsAsDuration(.000000000003234567)).is('3fs:234as:566zs');
}
export const fewAttoseconds = () => {
  expect(formatMsAsDuration(.000000000000003234567)).is('3as:234zs');
}
export const fewZeptoseconds = () => {
  expect(formatMsAsDuration(.000000000000000003234567)).is('3zs');
}
export const fewYoctoseconds = () => {
  expect(formatMsAsDuration(.0000000000000000003234567)).is('0s');
}
export const zero = () => {
  expect(formatMsAsDuration(0)).is('instant');
}
export const infinite = () => {
  expect(formatMsAsDuration(Infinity)).is('forever');
}
export const negateInfinite = () => {
  expect(formatMsAsDuration(-Infinity)).is('never');
}
export const notNumeric = () => {
  expect(formatMsAsDuration(new Date())).is(undefined);
}
export const maxSafeInteger = () => {
  expect(formatMsAsDuration(Number.MAX_SAFE_INTEGER)).is('285,426y:09m:11d');
}
export const minSafeInteger = () => {
  expect(formatMsAsDuration(Number.MIN_SAFE_INTEGER)).is('distant past');
}
export const minSafeIntegerPlus1 = () => {
  expect(formatMsAsDuration(Number.MIN_SAFE_INTEGER + 1)).is('-285,426y:09m:11d');
}
export const maxNumber = () => {
  expect(formatMsAsDuration(Number.MAX_VALUE)).is('distant future');
}
export const negativeInfinity = () => {
  expect(formatMsAsDuration(Number.NEGATIVE_INFINITY)).is('never');
}
export const positiveInfinity = () => {
  expect(formatMsAsDuration(Number.POSITIVE_INFINITY)).is('forever');
}
export const fractionClosestToOne = () => {
  expect(formatMsAsDuration(Number.EPSILON)).is('222zs');
}
export const fractionClosestToZero = () => {
  expect(formatMsAsDuration(Number.MIN_VALUE)).is('0s');
}
