import { Coins } from 'lucide-react';
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
  canAfford: boolean;
}

export function RenderCostBadge({ cost, canAfford }: RenderCostBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-help transition-colors',
              canAfford
                ? 'bg-secondary/50 text-foreground border border-border'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}
          >
            <Coins className="w-4 h-4" />
            <span>Render Cost: {cost.total} credits</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1.5 text-xs">
            <p className="font-medium text-foreground">Cost Breakdown:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-muted-foreground">
              <span>Base:</span>
              <span className="text-right font-mono">{cost.base}</span>
              <span>Duration:</span>
              <span className="text-right font-mono">{cost.duration}</span>
              <span>Speed (frames):</span>
              <span className="text-right font-mono">{cost.speed}</span>
            </div>
            <div className="pt-1.5 border-t border-border flex justify-between font-medium text-foreground">
              <span>Total:</span>
              <span className="font-mono">{cost.total} credits</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
