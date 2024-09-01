const OriginalDate = Date;

const set = (...defaultArgs) => {
  function CustomDate(...args) {
    const customArgs = args.length === 0 ? defaultArgs : args;
    return new OriginalDate(...customArgs);
  }
  CustomDate.prototype = OriginalDate.prototype;
  Date = CustomDate;
}
const setUtc = (...defaultArgs) => {
  set(OriginalDate.UTC(...defaultArgs));
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
