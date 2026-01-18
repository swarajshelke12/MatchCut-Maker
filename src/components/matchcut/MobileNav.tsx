import { useState } from 'react';
import { Type, Eye, Sliders } from 'lucide-react';
import { cn } from '@/lib/utils';

export type MobileTab = 'input' | 'preview' | 'controls';

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: 'input' as MobileTab, label: 'Text', icon: Type },
    { id: 'preview' as MobileTab, label: 'Preview', icon: Eye },
    { id: 'controls' as MobileTab, label: 'Settings', icon: Sliders },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className={cn(
                "text-xs font-medium",
                isActive && "text-primary"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 h-0.5 w-12 bg-primary rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
