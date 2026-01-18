import { Type, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileTab = 'edit' | 'settings';

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: 'edit' as MobileTab, label: 'Edit Text', icon: Type },
    { id: 'settings' as MobileTab, label: 'Settings & Export', icon: Sliders },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur-lg border-b border-border lg:hidden sticky top-[65px] z-40">
      <div className="flex items-center h-12 px-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center justify-center gap-2 flex-1 h-9 rounded-lg transition-all font-medium text-sm",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
