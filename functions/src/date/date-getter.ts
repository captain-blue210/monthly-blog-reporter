export const getLastDayOfMonth = (month: string): Date => {
  const date = new Date();
  date.setMonth(parseInt(month) - 1);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const getFirstDayOfMonth = (month: string): Date => {
  const date = new Date();
  date.setMonth(parseInt(month) - 1);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthStr = (month: string): string => {
  if (month) {
    return month.padStart(2, "0");
  }
  const monthNum = new Date().getMonth() + 1;
  return monthNum.toString().padStart(2, "0");
};
