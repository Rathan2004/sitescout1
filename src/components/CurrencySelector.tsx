import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrencyStore } from '@/store/currencyStore';
import { motion } from 'framer-motion';

export function CurrencySelector() {
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrencyStore();

  const currentCurrency = currencies.find((c) => c.code === selectedCurrency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentCurrency?.code || 'USD'}</span>
          <span className="font-semibold">{currentCurrency?.symbol || '$'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        {currencies.map((currency, index) => (
          <motion.div
            key={currency.code}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
          >
            <DropdownMenuItem
              onClick={() => setSelectedCurrency(currency.code)}
              className="cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{currency.symbol}</span>
                <div>
                  <div className="font-medium">{currency.code}</div>
                  <div className="text-xs text-muted-foreground">{currency.name}</div>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          </motion.div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
