export const dateToString = (value) => {
  let date = new Date(value);
  return `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
};
