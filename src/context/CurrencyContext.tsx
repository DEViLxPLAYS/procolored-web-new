import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  divisor: number;
  name: string;
}

const CURRENCIES: Record<string, Currency> = {
  US:  { code: 'USD', symbol: '$',     divisor: 278,   name: 'USD ($)' },
  GB:  { code: 'GBP', symbol: '£',     divisor: 352,   name: 'GBP (£)' },
  IN:  { code: 'INR', symbol: '₹',     divisor: 3.35,  name: 'INR (₹)' },
  AE:  { code: 'AED', symbol: 'د.إ',  divisor: 75.7,  name: 'AED (د.إ)' },
  SA:  { code: 'SAR', symbol: '﷼',    divisor: 74.1,  name: 'SAR (﷼)' },
  AU:  { code: 'AUD', symbol: 'A$',    divisor: 177,   name: 'AUD (A$)' },
  CA:  { code: 'CAD', symbol: 'C$',    divisor: 200,   name: 'CAD (C$)' },
  RU:  { code: 'RUB', symbol: '₽',     divisor: 3.1,   name: 'RUB (₽)' },
  TR:  { code: 'TRY', symbol: '₺',     divisor: 8.6,   name: 'TRY (₺)' },
  PK:  { code: 'PKR', symbol: 'Rs.',   divisor: 1,     name: 'PKR (Rs.)' },
};



const EUR_CURRENCY: Currency = { code: 'EUR', symbol: '€',   divisor: 302, name: 'EUR (€)' };


const ALL_CURRENCIES: Currency[] = [
  { code: 'PKR', symbol: 'Rs.', divisor: 1,   name: 'PKR (Rs.)' },
  { code: 'USD', symbol: '$',   divisor: 278,  name: 'USD ($)' },
  { code: 'GBP', symbol: '£',   divisor: 352,  name: 'GBP (£)' },
  EUR_CURRENCY,
  { code: 'INR', symbol: '₹',   divisor: 3.35, name: 'INR (₹)' },
  { code: 'AED', symbol: 'د.إ', divisor: 75.7, name: 'AED (د.إ)' },
  { code: 'SAR', symbol: '﷼',   divisor: 74.1, name: 'SAR (﷼)' },
  { code: 'AUD', symbol: 'A$',  divisor: 177,  name: 'AUD (A$)' },
  { code: 'CAD', symbol: 'C$',  divisor: 200,  name: 'CAD (C$)' },
  { code: 'RUB', symbol: '₽',   divisor: 3.1,  name: 'RUB (₽)' },
  { code: 'TRY', symbol: '₺',   divisor: 8.6,  name: 'TRY (₺)' },
];

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  allCurrencies: Currency[];
  formatPrice: (pkrAmount: number) => string;
  formatConverted: (convertedAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('procolored_user_currency');
      if (saved) {
        const parsed = JSON.parse(saved) as Currency;
        if (parsed?.code && parsed?.divisor) return parsed;
      }
    } catch { /* ignore */ }
    return CURRENCIES.US;
  });

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem('procolored_user_currency', JSON.stringify(c)); } catch { /* ignore */ }
  }, []);



  const formatPrice = useCallback((pkrAmount: number): string => {
    const converted = pkrAmount / currency.divisor;
    const rounded = Math.round(converted * 100) / 100;
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency.symbol}${formatted} ${currency.code}`;
  }, [currency]);

  const formatConverted = useCallback((convertedAmount: number): string => {
    const rounded = Math.round(convertedAmount * 100) / 100;
    const formatted = rounded.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency.symbol}${formatted} ${currency.code}`;
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, allCurrencies: ALL_CURRENCIES, formatPrice, formatConverted }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

/**
 * Parse a PKR price string like "Rs.798,000.00 PKR" → 798000
 */
export function parsePKR(priceStr: string): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/Rs\./gi, '').replace(/PKR/gi, '').replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

/**
 * Robust price converter that handles:
 * - PKR strings: "Rs.569,300.00" or "PKR 569300" → base / divisor
 * - USD-tagged/plain strings: "$2,047.84 USD" → treat as USD, convert to current currency via USD→PKR (×278) ÷ divisor
 */
export function convertPrice(priceStr: string, divisor: number): number {
  if (!priceStr) return 0;
  const normalized = priceStr.toLowerCase();

  // If it's explicitly PKR or includes "Rs.", treat as base and convert
  if (normalized.includes('rs.') || normalized.includes('pkr')) {
    return parsePKR(priceStr) / divisor;
  }

  // Otherwise treat as USD
  const cleaned = priceStr
    .replace(/^\$usd:/i, '')
    .replace(/USD/gi, '')
    .replace(/[$£€]/g, '')
    .replace(/,/g, '')
    .trim();
    
  const usdVal = parseFloat(cleaned);
  if (isNaN(usdVal)) return 0;
  
  // Convert USD → current currency: USD×278 gives PKR, then ÷ divisor
  return (usdVal * 278) / divisor;
}
