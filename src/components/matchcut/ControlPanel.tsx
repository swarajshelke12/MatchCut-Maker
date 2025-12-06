import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CURATED_FONTS } from '@/lib/fonts';
import { Shuffle, Settings2, Palette, Video, Image } from 'lucide-react';
import { MatchCutSettings } from '@/lib/matchcut';
import { CreditCost } from '@/lib/credits';
import { CreditMeter } from '@/components/credits/CreditMeter';
import { RenderCostBadge } from '@/components/credits/RenderCostBadge';

export type ExportFormat = 'video' | 'png';

interface ControlPanelProps {
  settings: MatchCutSettings;
  onSettingsChange: (settings: Partial<MatchCutSettings>) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  exportProgress: number;
  // Credit props
  isTrial: boolean;
  trialDaysLeft: number;
  monthlyCredits: number;
  remainingDaily: number;
  purchasedCredits: number;
  monthlyColor: 'green' | 'yellow' | 'red';
  dailyColor: 'green' | 'yellow' | 'red';
  creditResetDate?: string;
  renderCost: CreditCost;
  canAfford: boolean;
  onPurchaseCredits: (pack: 'PACK_200' | 'PACK_500') => void;
}

export function ControlPanel({
  settings,
  onSettingsChange,
  onExport,
  isExporting,
  exportProgress,
  isTrial,
  trialDaysLeft,
  monthlyCredits,
  remainingDaily,
  purchasedCredits,
  monthlyColor,
  dailyColor,
  creditResetDate,
  renderCost,
  canAfford,
  onPurchaseCredits,
}: ControlPanelProps) {
  const [showAllFonts, setShowAllFonts] = useState(false);

  const handleFontToggle = (fontName: string, checked: boolean) => {
    const newFonts = checked
      ? [...settings.selectedFonts, fontName]
      : settings.selectedFonts.filter((f) => f !== fontName);
    onSettingsChange({ selectedFonts: newFonts });
  };

  const handleSelectAll = () => {
    onSettingsChange({ selectedFonts: CURATED_FONTS.map((f) => f.name) });
  };

  const handleClearAll = () => {
    onSettingsChange({ selectedFonts: [] });
  };

  const randomizeSeed = () => {
    onSettingsChange({ seed: Math.floor(Math.random() * 999999) });
  };

  const displayedFonts = showAllFonts ? CURATED_FONTS : CURATED_FONTS.slice(0, 10);
  const canExport = settings.text.trim() && (isTrial || canAfford);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Credit Meter */}
      <div className="pb-3 border-b border-border">
        <CreditMeter
          isTrial={isTrial}
          trialDaysLeft={trialDaysLeft}
          monthlyCredits={monthlyCredits}
          remainingDaily={remainingDaily}
          purchasedCredits={purchasedCredits}
          monthlyColor={monthlyColor}
          dailyColor={dailyColor}
          creditResetDate={creditResetDate}
          onPurchase={onPurchaseCredits}
        />
      </div>

      {/* Font Pool */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            Font Pool ({settings.selectedFonts.length || 'All'})
          </Label>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              None
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[100px] rounded-md border border-border bg-secondary/30 p-3">
          <div className="space-y-2">
            {displayedFonts.map((font) => (
              <div key={font.name} className="flex items-center gap-2">
                <Checkbox
                  id={font.name}
                  checked={
                    settings.selectedFonts.length === 0 ||
                    settings.selectedFonts.includes(font.name)
                  }
                  onCheckedChange={(checked) =>
                    handleFontToggle(font.name, !!checked)
                  }
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor={font.name}
                  className="text-sm text-foreground cursor-pointer flex-1"
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </label>
                <span className="text-xs text-muted-foreground capitalize">
                  {font.category}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
        {!showAllFonts && CURATED_FONTS.length > 10 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllFonts(true)}
            className="w-full mt-2 text-xs text-muted-foreground hover:text-primary"
          >
            Show all {CURATED_FONTS.length} fonts
          </Button>
        )}
      </div>

      {/* Timing Controls */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Timing & Speed
        </Label>

        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Frames per card</span>
              <span className="font-mono">{settings.framesPerCard}</span>
            </div>
            <Slider
              value={[settings.framesPerCard]}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => onSettingsChange({ framesPerCard: v[0] })}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Duration (seconds)</span>
              <span className="font-mono">{settings.duration}s</span>
            </div>
            <Slider
              value={[settings.duration]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(v) => onSettingsChange({ duration: v[0] })}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>FPS</span>
              <span className="font-mono">{settings.fps}</span>
            </div>
            <Slider
              value={[settings.fps]}
              min={24}
              max={60}
              step={6}
              onValueChange={(v) => onSettingsChange({ fps: v[0] })}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Font size</span>
              <span className="font-mono">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={48}
              max={300}
              step={12}
              onValueChange={(v) => onSettingsChange({ fontSize: v[0] })}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Foreground
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.foregroundColor}
                onChange={(e) =>
                  onSettingsChange({ foregroundColor: e.target.value })
                }
                className="w-10 h-8 p-0.5 bg-secondary border-border cursor-pointer"
              />
              <Input
                type="text"
                value={settings.foregroundColor}
                onChange={(e) =>
                  onSettingsChange({ foregroundColor: e.target.value })
                }
                className="flex-1 h-8 bg-secondary/50 border-border font-mono text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Background
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.backgroundColor === 'transparent' ? '#000000' : settings.backgroundColor}
                onChange={(e) =>
                  onSettingsChange({ backgroundColor: e.target.value })
                }
                className="w-10 h-8 p-0.5 bg-secondary border-border cursor-pointer"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) =>
                  onSettingsChange({ backgroundColor: e.target.value })
                }
                className="flex-1 h-8 bg-secondary/50 border-border font-mono text-xs"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seed */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Shuffle className="w-4 h-4 text-primary" />
          Randomization Seed
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            value={settings.seed}
            onChange={(e) =>
              onSettingsChange({ seed: parseInt(e.target.value) || 0 })
            }
            className="flex-1 bg-secondary/50 border-border font-mono"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={randomizeSeed}
            className="bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mt-auto pt-3 border-t border-border space-y-2">
        {/* Cost Badge */}
        {settings.text.trim() && (
          <div className="flex justify-center mb-2">
            <RenderCostBadge 
              cost={renderCost} 
              isTrial={isTrial} 
              canAfford={canAfford} 
            />
          </div>
        )}

        <Button
          onClick={() => onExport('video')}
          disabled={isExporting || !canExport}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Generating... {Math.round(exportProgress * 100)}%
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Export Video (WebM)
            </>
          )}
        </Button>
        
        <Button
          onClick={() => onExport('png')}
          disabled={isExporting || !canExport}
          variant="outline"
          className="w-full bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
        >
          <Image className="w-4 h-4 mr-2" />
          Export PNG Sequence
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          WebM video ready to drop into any editor
        </p>
      </div>
    </div>
  );
}
