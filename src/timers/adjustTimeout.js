
const granularityCompensation = 4;
const minimumDelay = 4;

export const adjustTimeout = ms => Math.max(minimumDelay, ms + granularityCompensation);
