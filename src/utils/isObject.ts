export const isObject = (value: any, allowNull: boolean = false): value is object => {
  return typeof value === 'object' && (allowNull || value !== null);
}