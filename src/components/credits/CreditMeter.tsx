import { cn } from '@/lib/utils';
import { Coins, Zap, Calendar, Gift, Sparkles } from 'lucide-react';
import { CREDIT_CONFIG, formatResetDate } from '@/lib/credits';
import { BuyCreditsDialog } from './BuyCreditsDialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CreditMeterProps {
  bonusCredits: number;
  monthlyCredits: number;
  remainingDaily: number;
  purchasedCredits: number;
  bonusColor: 'green' | 'yellow' | 'red';
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
  green: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  yellow: 'bg-gradient-to-r from-amber-500 to-amber-400',
  red: 'bg-gradient-to-r from-red-500 to-red-400',
};

export function CreditMeter({
  bonusCredits,
  monthlyCredits,
  remainingDaily,
  purchasedCredits,
  bonusColor,
  monthlyColor,
  dailyColor,
  creditResetDate,
  onPurchase,
}: CreditMeterProps) {
  const bonusMax = CREDIT_CONFIG.BONUS_CREDITS;
  const monthlyMax = CREDIT_CONFIG.MONTHLY_CREDITS;
  const dailyMax = CREDIT_CONFIG.DAILY_LIMIT;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            Credits
          </h3>
          <span className="text-xs text-muted-foreground font-mono">
            Total: {bonusCredits + monthlyCredits + purchasedCredits}
          </span>
        </div>

        {/* Credit Bars */}
        <div className="space-y-3">
          {/* Bonus Credits */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="space-y-1.5 cursor-help">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className={cn('w-3.5 h-3.5', colorClasses[bonusColor])} />
                    <span className="text-xs text-muted-foreground">Bonus</span>
                  </div>
                  <span className={cn('text-xs font-mono font-medium', colorClasses[bonusColor])}>
                    {bonusCredits}
                  </span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', bgColorClasses[bonusColor])}>
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[bonusColor])}
                    style={{ width: `${Math.min(100, (bonusCredits / bonusMax) * 100)}%` }}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]">
              <p className="text-xs">
                <span className="font-medium text-primary">Bonus credits are used first.</span> These are one-time credits from welcome bonuses or promotions.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Monthly Credits */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className={cn('w-3.5 h-3.5', colorClasses[monthlyColor])} />
                <span className="text-xs text-muted-foreground">Monthly</span>
              </div>
              <span className={cn('text-xs font-mono font-medium', colorClasses[monthlyColor])}>
                {monthlyCredits} / {monthlyMax}
              </span>
            </div>
            <div className={cn('h-2 rounded-full overflow-hidden', bgColorClasses[monthlyColor])}>
              <div
                className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[monthlyColor])}
                style={{ width: `${(monthlyCredits / monthlyMax) * 100}%` }}
              />
            </div>
          </div>

          {/* Daily Limit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className={cn('w-3.5 h-3.5', colorClasses[dailyColor])} />
                <span className="text-xs text-muted-foreground">Daily Limit</span>
              </div>
              <span className={cn('text-xs font-mono font-medium', colorClasses[dailyColor])}>
                {remainingDaily} / {dailyMax}
              </span>
            </div>
            <div className={cn('h-2 rounded-full overflow-hidden', bgColorClasses[dailyColor])}>
              <div
                className={cn('h-full rounded-full transition-all duration-500', progressColorClasses[dailyColor])}
                style={{ width: `${(remainingDaily / dailyMax) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Purchased Credits Badge */}
        {purchasedCredits > 0 && (
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <span className="text-xs text-muted-foreground">Purchased Credits</span>
            <span className="text-sm font-mono font-semibold text-primary">
              +{purchasedCredits}
            </span>
          </div>
        )}

        {/* Reset Date */}
        {creditResetDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>Monthly resets {formatResetDate(creditResetDate)}</span>
          </div>
        )}

        {/* Buy Credits Button */}
        <BuyCreditsDialog onPurchase={onPurchase} />
      </div>
    </TooltipProvider>
  );
}
