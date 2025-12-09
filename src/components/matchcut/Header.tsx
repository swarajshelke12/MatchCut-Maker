import { Scissors } from 'lucide-react';
import { AdminPanel } from '@/components/credits/AdminPanel';

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Scissors className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              MatchCut Maker
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Rapid font-switching text effects
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden md:inline">
            Export to Premiere, After Effects, DaVinci & more
          </span>
          <AdminPanel />
        </div>
      </div>
    </header>
  );
}
