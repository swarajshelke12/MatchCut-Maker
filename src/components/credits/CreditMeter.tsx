import { cn } from '@/lib/utils';
import { Coins, Zap, Calendar, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CREDIT_CONFIG, formatResetDate } from '@/lib/credits';
import { BuyCreditsDialog } from './BuyCreditsDialog';

interface CreditMeterProps {
  isTrial: boolean;
  trialDaysLeft: number;
  monthlyCredits: number;
  remainingDaily: number;
  purchasedCredits: number;
  monthlyColor: 'green' | 'yellow' | 'red';
  dailyColor: 'green' | 'yellow' | 'red';
  creditResetDate?: string;
  onPurchase: (pack: 'PACK_200' | 'PACK_500') => void;
}

const colorClasses = {
  green: 'text-emerald-400',
  yellow: 'text-amber-400',
  red: 'text-red-400',
};

const bgColorClasses = {
  green: 'bg-emerald-500/20',
  yellow: 'bg-amber-500/20',
  red: 'bg-red-500/20',
};

const progressColorClasses = {
  green: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  red: 'bg-red-500',
};

export function CreditMeter({
  isTrial,
  trialDaysLeft,
  monthlyCredits,
  remainingDaily,
  purchasedCredits,
  monthlyColor,
  dailyColor,
  creditResetDate,
  onPurchase,
}: CreditMeterProps) {
  const monthlyMax = CREDIT_CONFIG.MONTHLY_CREDITS;
  const dailyMax = CREDIT_CONFIG.DAILY_LIMIT;

  return (
    <div className="space-y-3">
      {/* Trial Badge */}
      {isTrial && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Gift className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">
            Free Trial Active — {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left
          </span>
        </div>
      )}

      {/* Credit Meters */}
      <div className="space-y-2">
        {/* Monthly Credits */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className={cn('w-4 h-4', colorClasses[monthlyColor])} />
            <span className="text-xs text-muted-foreground">Monthly</span>
          </div>
          <span className={cn('text-sm font-mono font-medium', colorClasses[monthlyColor])}>
            {monthlyCredits} / {monthlyMax}
          </span>
        </div>
        <div className={cn('h-1.5 rounded-full overflow-hidden', bgColorClasses[monthlyColor])}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[monthlyColor])}
            style={{ width: `${(monthlyCredits / monthlyMax) * 100}%` }}
          />
        </div>

        {/* Daily Credits */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Zap className={cn('w-4 h-4', colorClasses[dailyColor])} />
            <span className="text-xs text-muted-foreground">Daily</span>
          </div>
          <span className={cn('text-sm font-mono font-medium', colorClasses[dailyColor])}>
            {remainingDaily} / {dailyMax}
          </span>
        </div>
        <div className={cn('h-1.5 rounded-full overflow-hidden', bgColorClasses[dailyColor])}>
          <div
            className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[dailyColor])}
            style={{ width: `${(remainingDaily / dailyMax) * 100}%` }}
          />
        </div>
      </div>

      {/* Purchased Credits */}
      {purchasedCredits > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Bonus Credits</span>
          <Badge variant="secondary" className="font-mono">
            +{purchasedCredits}
          </Badge>
        </div>
      )}

      {/* Reset Date */}
      {creditResetDate && !isTrial && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Resets {formatResetDate(creditResetDate)}</span>
        </div>
      )}

      {/* Buy Credits Button */}
      {!isTrial && (
        <BuyCreditsDialog onPurchase={onPurchase} />
      )}
    </div>
  );
}
