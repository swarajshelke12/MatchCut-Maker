import { Scissors, Sparkles } from 'lucide-react';
import { AdminPanel } from '@/components/credits/AdminPanel';

export function Header() {
  return (
    <header className="border-b border-border/40 glass-panel-strong sticky top-0 z-50 rounded-none">
      <div className="container mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow transition-all duration-300 group-hover:shadow-glow-strong group-hover:scale-105">
            <Scissors className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-glow animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight gradient-text leading-none">
              MatchCut Maker
            </h1>
            <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5 tracking-wide">
              Rapid font-switching text effects
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-muted-foreground glass-chip rounded-full px-3 py-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            Premiere · After Effects · DaVinci
          </span>
          <AdminPanel />
        </div>
      </div>
    </header>
  );
}
