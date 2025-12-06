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
import { ShoppingCart, CreditCard, Sparkles } from 'lucide-react';
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
        <Button variant="outline" size="sm" className="w-full gap-2">
          <ShoppingCart className="w-4 h-4" />
          Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Get More Credits
          </DialogTitle>
          <DialogDescription>
            Choose a credit pack to continue creating amazing MatchCut effects.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {/* Pack 200 */}
          <button
            onClick={() => handlePurchase('PACK_200')}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg border-2 border-border',
              'hover:border-primary/50 hover:bg-secondary/50 transition-all',
              'text-left group'
            )}
          >
            <div>
              <div className="font-semibold text-foreground">
                {CREDIT_CONFIG.PACK_PRICES.PACK_200.credits} Credits
              </div>
              <div className="text-sm text-muted-foreground">
                ~10 renders
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ${CREDIT_CONFIG.PACK_PRICES.PACK_200.price}
              </span>
              <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>

          {/* Pack 500 - Best Value */}
          <button
            onClick={() => handlePurchase('PACK_500')}
            className={cn(
              'relative flex items-center justify-between p-4 rounded-lg border-2',
              'border-primary/50 bg-primary/5',
              'hover:border-primary hover:bg-primary/10 transition-all',
              'text-left group'
            )}
          >
            <div className="absolute -top-2 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
              Best Value
            </div>
            <div>
              <div className="font-semibold text-foreground">
                {CREDIT_CONFIG.PACK_PRICES.PACK_500.credits} Credits
              </div>
              <div className="text-sm text-muted-foreground">
                ~25 renders
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">
                ${CREDIT_CONFIG.PACK_PRICES.PACK_500.price}
              </span>
              <CreditCard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Secure payment via Stripe. Credits never expire.
        </p>
      </DialogContent>
    </Dialog>
  );
}
