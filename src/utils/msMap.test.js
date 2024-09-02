import { msMap } from "./msMap.js";
import { expect } from '../../scripts/utils/expect.js';

const regularYearDays = 365;
const leapYearDays = regularYearDays + 1;
const yearsInCycle = 400;
const centuryYearsOtherThan400 = Math.floor(yearsInCycle / 100) - 1;
const regularYearsInCycle = (yearsInCycle - (yearsInCycle / 4)) + centuryYearsOtherThan400;
const leapYearsInCycle = (yearsInCycle / 4) - centuryYearsOtherThan400;
const daysInCycle = (regularYearsInCycle * regularYearDays) + (leapYearsInCycle * leapYearDays);
const averageDaysInYear = daysInCycle / yearsInCycle;

export const ms = () => {
  expect(msMap.ms).is(1);
}
export const second = () => {
  expect(msMap.s).is(1000);
}
export const minute = () => {
  expect(msMap.mi).is(1000 * 60);
}
export const hour = () => {
  expect(msMap.h).is(1000 * 60 * 60);
}
export const day = () => {
  expect(msMap.d).is(1000 * 60 * 60 * 24);
}
export const week = () => {
  expect(msMap.w).is(1000 * 60 * 60 * 24 * 7);
}
export const mo = () => {
  expect(msMap.mo).is(1000 * 60 * 60 * 24 * (averageDaysInYear / 12));
}
export const y = () => {
  expect(msMap.y).is(1000 * 60 * 60 * 24 * averageDaysInYear);
}
