import { currencies } from './mockData';

export const convertPrice = (amount: number, from: string, to: string): number => {
  const fromCurrency = currencies.find((c) => c.code === from);
  const toCurrency = currencies.find((c) => c.code === to);

  if (!fromCurrency || !toCurrency) return amount;

  const usdAmount = amount / fromCurrency.rate;
  return usdAmount * toCurrency.rate;
};

export const getCurrencySymbol = (code: string): string => {
  const currency = currencies.find((c) => c.code === code);
  return currency?.symbol || '$';
};
