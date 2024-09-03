import { msMap, microsecondKey } from "./msMap.js";
import { expect } from '../../scripts/utils/expect.js';

const regularYearDays = 365;
const leapYearDays = regularYearDays + 1;
const yearsInCycle = 400;
const centuryYearsOtherThan400 = Math.floor(yearsInCycle / 100) - 1;
const regularYearsInCycle = (yearsInCycle - (yearsInCycle / 4)) + centuryYearsOtherThan400;
const leapYearsInCycle = (yearsInCycle / 4) - centuryYearsOtherThan400;
const daysInCycle = (regularYearsInCycle * regularYearDays) + (leapYearsInCycle * leapYearDays);
const averageDaysInYear = daysInCycle / yearsInCycle;
const averageDaysInMonth = (averageDaysInYear / 12);

const msPerSecond = 1000;
const secondsPerMinute = 60;
const minutesPerHour = 60;
const hoursPerDay = 24;
const daysPerWeek = 7;
const yearsPerDecade = 10;
const decadesPerCentury = 10;
const centuriesPerMillenia = 10;

export const zeptosecond = () => {
  expect(msMap.zs).is(Math.pow(10, -18));
}
export const attosecond = () => {
  expect(msMap.as).is(Math.pow(10, -15));
}
export const femtosecond = () => {
  expect(msMap.fs).is(Math.pow(10, -12));
}
export const picosecond = () => {
  expect(msMap.ps).is(Math.pow(10, -9));
}
export const nanosecond = () => {
  expect(msMap.ns).is(Math.pow(10, -6));
}
export const microsecond = () => {
  expect(msMap[microsecondKey]).is(Math.pow(10, -3));
}
export const millisecond = () => {
  expect(msMap.ms).is(1);
}
export const second = () => {
  expect(msMap.s).is(msPerSecond);
}
export const minute = () => {
  expect(msMap.mi).is(msPerSecond * secondsPerMinute);
}
export const hour = () => {
  expect(msMap.h).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour
  );
}
export const day = () => {
  expect(msMap.d).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay
  );
}
export const week = () => {
  expect(msMap.w).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    daysPerWeek
  );
}
export const mo = () => {
  expect(msMap.mo).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    averageDaysInMonth
  );
}
export const year = () => {
  expect(msMap.y).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    averageDaysInYear
  );
}
export const decade = () => {
  expect(msMap.dec).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    averageDaysInYear *
    yearsPerDecade
  );
}
export const century = () => {
  expect(msMap.cen).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    averageDaysInYear *
    yearsPerDecade *
    decadesPerCentury
  );
}
export const millenia = () => {
  expect(msMap.mil).is(
    msPerSecond *
    secondsPerMinute *
    minutesPerHour *
    hoursPerDay *
    averageDaysInYear *
    yearsPerDecade *
    decadesPerCentury *
    centuriesPerMillenia
  );
}