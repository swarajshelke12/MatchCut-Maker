import { Type, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileTab = 'input' | 'controls';

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: 'input' as MobileTab, label: 'Create', icon: Type },
    { id: 'controls' as MobileTab, label: 'Settings', icon: Sliders },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center justify-center gap-2 flex-1 h-full transition-all rounded-lg mx-1",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
