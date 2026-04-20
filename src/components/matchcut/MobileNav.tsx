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
    <nav className="fixed bottom-3 left-3 right-3 z-50 glass-panel-strong rounded-2xl lg:hidden overflow-hidden">
      <div className="flex items-center justify-around h-14 px-1.5 relative">
        {/* Sliding indicator */}
        <div
          className={cn(
            "absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-gradient-primary shadow-glow transition-all duration-300 ease-smooth",
            activeTab === 'input' ? 'left-1.5' : 'left-[50%]'
          )}
        />
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 flex-1 h-full transition-colors duration-300",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn("text-sm tracking-wide", isActive ? "font-semibold" : "font-medium")}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
