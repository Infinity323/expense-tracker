export const dateToString = (value) => {
  const date = new Date(Number(value));
  const month = new Intl.DateTimeFormat(undefined, {
    month: "long",
    timeZone: "UTC",
  }).format(date);
  return `${month} ${date.getUTCFullYear()}`;
};

export const dateToMMMYYYY = (value: string): string => {
  const date = new Date(Number(value));
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};
