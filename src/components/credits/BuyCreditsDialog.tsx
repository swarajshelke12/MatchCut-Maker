import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, Sparkles, Check } from 'lucide-react';
import { CREDIT_CONFIG } from '@/lib/credits';
import { cn } from '@/lib/utils';

interface BuyCreditsDialogProps {
  onPurchase: (pack: 'PACK_200' | 'PACK_500') => void;
}

export function BuyCreditsDialog({ onPurchase }: BuyCreditsDialogProps) {
  const [open, setOpen] = useState(false);

  const handlePurchase = (pack: 'PACK_200' | 'PACK_500') => {
    onPurchase(pack);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full gap-2 bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="flex items-center justify-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-primary" />
            Buy More Credits
          </DialogTitle>
          <DialogDescription className="text-center">
            Get more credits to create amazing MatchCut effects.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          {/* Pack 200 */}
          <button
            onClick={() => handlePurchase('PACK_200')}
            className={cn(
              'flex items-center justify-between p-5 rounded-xl border-2 border-border',
              'hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200',
              'text-left group'
            )}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">200</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">
                  200 Credits
                </div>
                <div className="text-sm text-muted-foreground">
                  ~10 high-quality renders
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-foreground">
                {CREDIT_CONFIG.PACK_PRICES.PACK_200.currency}{CREDIT_CONFIG.PACK_PRICES.PACK_200.price}
              </span>
              <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>

          {/* Pack 500 - Best Value */}
          <button
            onClick={() => handlePurchase('PACK_500')}
            className={cn(
              'relative flex items-center justify-between p-5 rounded-xl border-2',
              'border-primary/50 bg-primary/5',
              'hover:border-primary hover:bg-primary/10 transition-all duration-200',
              'text-left group'
            )}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center gap-1">
              <Check className="w-3 h-3" />
              Best Value
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">500</span>
              </div>
              <div>
                <div className="text-lg font-semibold text-foreground">
                  500 Credits
                </div>
                <div className="text-sm text-muted-foreground">
                  ~25 high-quality renders
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-2xl font-bold text-primary">
                {CREDIT_CONFIG.PACK_PRICES.PACK_500.currency}{CREDIT_CONFIG.PACK_PRICES.PACK_500.price}
              </span>
              <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>

        <div className="space-y-2 text-center">
          <p className="text-xs text-muted-foreground">
            Secure payment via Stripe • Credits never expire
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
