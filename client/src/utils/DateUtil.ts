import { format, fromUnixTime } from 'date-fns';

export const dateToString = (value) => {
  let date = new Date(value);
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
};

export const dateToMMMYYYY = (value: string): string => {
  const date = fromUnixTime(parseInt(value) / 1000);
  return format(date, 'MMM yyyy');
}