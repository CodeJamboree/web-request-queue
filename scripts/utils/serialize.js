export const serialize = value => JSON.stringify(value, (key, value) => {
  if (typeof value === 'object') {
    if (value instanceof Error) return value.message;
    // switch (value?.constructor?.name) {
    //   case 'Timeout':
    //     return `Timeout(Destroyed: ${value._destroyed})`;
    // }
  }
  if (typeof value === 'function') {
    let name = value.name;
    if ((name ?? '') === '') return '[Function (anonymous)]';
    return `[Function ${name}]`;
  }
  return value;
}, '  ');