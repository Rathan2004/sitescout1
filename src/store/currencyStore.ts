import { create } from 'zustand';
import { Currency } from '@/types';
import { currencies } from '@/utils/mockData';
import { convertPrice as convert } from '@/utils/currencyConverter';

interface CurrencyState {
  currencies: Currency[];
  selectedCurrency: string;
  setSelectedCurrency: (code: string) => void;
  convertPrice: (price: number, from: string, to: string) => number;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currencies,
  selectedCurrency: localStorage.getItem('selected_currency') || 'USD',
  
  setSelectedCurrency: (code) => {
    localStorage.setItem('selected_currency', code);
    set({ selectedCurrency: code });
  },
  
  convertPrice: (price, from, to) => {
    return convert(price, from, to);
  },
}));
