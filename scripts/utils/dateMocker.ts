const OriginalDate = Date;

type dateArgs = [] |
[vd: VarDate] |
[value: number | string | Date] |
[year: number, monthIndex?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number]

const set = (...defaultArgs: dateArgs) => {
  function CustomDate(...args: dateArgs) {
    const customArgs = args.length === 0 ? defaultArgs : args;
    // @ts-expect-error
    return new OriginalDate(...customArgs);
  }
  CustomDate.prototype = OriginalDate.prototype;
  // @ts-expect-error
  Date = CustomDate;
}
const setUtc = (year: number, monthIndex?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) => {
  set(OriginalDate.UTC(year, monthIndex, date, hours, minutes, seconds, ms));
}
const freeze = () => {
  set((new OriginalDate()).getTime());
}

const restore = () => {
  Date = OriginalDate;
}

export const dateMocker = {
  freeze,
  set,
  setUtc,
  restore
}
