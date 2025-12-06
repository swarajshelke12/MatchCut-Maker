import { Coins, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreditCost } from '@/lib/credits';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RenderCostBadgeProps {
  cost: CreditCost;
  isTrial: boolean;
  canAfford: boolean;
}

export function RenderCostBadge({ cost, isTrial, canAfford }: RenderCostBadgeProps) {
  if (isTrial) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
        <Gift className="w-3.5 h-3.5" />
        <span>Free Trial — no credits</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
              canAfford
                ? 'bg-secondary/50 text-foreground'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Cost: {cost.total} credits</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1 text-xs">
            <p className="font-medium">Cost Breakdown:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
              <span>Base:</span>
              <span className="text-right">{cost.base.toFixed(1)}</span>
              <span>Fonts ({Math.round(cost.fonts / 0.5)}):</span>
              <span className="text-right">{cost.fonts.toFixed(1)}</span>
              <span>Duration:</span>
              <span className="text-right">{cost.duration.toFixed(1)}</span>
              <span>Frames:</span>
              <span className="text-right">{cost.frames.toFixed(1)}</span>
            </div>
            <div className="pt-1 border-t border-border flex justify-between font-medium text-foreground">
              <span>Total:</span>
              <span>{cost.total} credits</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
