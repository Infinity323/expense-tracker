/** Rounds number to the nearest hundredth. */
export const round = (amount: number) => parseFloat(amount.toFixed(2));

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
