import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CURATED_FONTS } from '@/lib/fonts';
import { ANIMATION_STYLES, getAnimationStyle, AnimationStyleId } from '@/lib/animationStyles';
import { Shuffle, Settings2, Palette, Video, Image, Wand2, Clock, Monitor, Timer } from 'lucide-react';
import { MatchCutSettings, ASPECT_RATIOS, AspectRatioId } from '@/lib/matchcut';
import { CreditCost, estimateRenderTime } from '@/lib/credits';
import { CreditMeter } from '@/components/credits/CreditMeter';
import { RenderCostBadge } from '@/components/credits/RenderCostBadge';
import { cn } from '@/lib/utils';

export type ExportFormat = 'video' | 'png';

interface ControlPanelProps {
  settings: MatchCutSettings;
  onSettingsChange: (settings: Partial<MatchCutSettings>) => void;
  onExport: (format: ExportFormat) => void;
  isExporting: boolean;
  exportProgress: number;
  // Credit props
  bonusCredits: number;
  monthlyCredits: number;
  remainingDaily: number;
  purchasedCredits: number;
  bonusColor: 'green' | 'yellow' | 'red';
  monthlyColor: 'green' | 'yellow' | 'red';
  dailyColor: 'green' | 'yellow' | 'red';
  creditResetDate?: string;
  renderCost: CreditCost;
  canAfford: boolean;
  // Animation style
  selectedAnimationStyle: string | null;
  onAnimationStyleChange: (styleId: string) => void;
  // Preview
  totalFrames: number;
  fps: number;
  // Cooldown
  isOnCooldown: boolean;
  cooldownRemaining: string;
}

export function ControlPanel({
  settings,
  onSettingsChange,
  onExport,
  isExporting,
  exportProgress,
  bonusCredits,
  monthlyCredits,
  remainingDaily,
  purchasedCredits,
  bonusColor,
  monthlyColor,
  dailyColor,
  creditResetDate,
  renderCost,
  canAfford,
  selectedAnimationStyle,
  onAnimationStyleChange,
  totalFrames,
  fps,
  isOnCooldown,
  cooldownRemaining,
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
    // Set to a special marker that means "none selected"
    onSettingsChange({ selectedFonts: ['__NONE__'] });
  };
  
  // Check if fonts are effectively cleared (none selected)
  const isNoneSelected = settings.selectedFonts.length === 1 && settings.selectedFonts[0] === '__NONE__';

  const randomizeSeed = () => {
    onSettingsChange({ seed: Math.floor(Math.random() * 999999) });
  };

  const displayedFonts = showAllFonts ? CURATED_FONTS : CURATED_FONTS.slice(0, 10);
  const canExport = settings.text.trim() && canAfford && !isOnCooldown;
  const estimatedTime = estimateRenderTime(totalFrames, fps);

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Credit Meter */}
      <div className="pb-4 border-b border-border">
        <CreditMeter
          bonusCredits={bonusCredits}
          monthlyCredits={monthlyCredits}
          remainingDaily={remainingDaily}
          purchasedCredits={purchasedCredits}
          bonusColor={bonusColor}
          monthlyColor={monthlyColor}
          dailyColor={dailyColor}
          creditResetDate={creditResetDate}
        />
      </div>

      {/* Animation Style */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-primary" />
          Animation Style
        </Label>
        <Select value={selectedAnimationStyle || ''} onValueChange={onAnimationStyleChange}>
          <SelectTrigger className="w-full bg-secondary/50 border-border">
            <SelectValue placeholder="Choose a style preset" />
          </SelectTrigger>
          <SelectContent>
            {ANIMATION_STYLES.map((style) => (
              <SelectItem key={style.id} value={style.id}>
                <div className="flex flex-col">
                  <span className="font-medium">{style.name}</span>
                  <span className="text-xs text-muted-foreground">{style.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          Aspect Ratio
        </Label>
        <Select 
          value={settings.aspectRatio} 
          onValueChange={(value: AspectRatioId) => onSettingsChange({ aspectRatio: value })}
        >
          <SelectTrigger className="w-full bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ASPECT_RATIOS.map((ar) => (
              <SelectItem key={ar.id} value={ar.id}>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium">{ar.id}</span>
                  <span className="text-xs text-muted-foreground">{ar.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Pool */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
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
        <ScrollArea className="h-[100px] rounded-lg border border-border bg-secondary/20 p-3">
          <div className="space-y-2">
            {isNoneSelected ? (
              <p className="text-sm text-muted-foreground text-center py-2">No fonts selected. Click "All" or select fonts below.</p>
            ) : null}
            {displayedFonts.map((font) => (
              <div key={font.name} className="flex items-center gap-2">
                <Checkbox
                  id={font.name}
                  checked={
                    !isNoneSelected && (settings.selectedFonts.length === 0 || settings.selectedFonts.includes(font.name))
                  }
                  onCheckedChange={(checked) => {
                    // If none was selected and user checks a font, start fresh
                    if (isNoneSelected && checked) {
                      onSettingsChange({ selectedFonts: [font.name] });
                    } else {
                      handleFontToggle(font.name, !!checked);
                    }
                  }}
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
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-primary" />
          Timing & Speed
        </Label>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Frames per card</span>
              <span className="font-mono font-medium text-foreground">{settings.framesPerCard}</span>
            </div>
            <Slider
              value={[settings.framesPerCard]}
              min={1}
              max={10}
              step={1}
              onValueChange={(v) => onSettingsChange({ framesPerCard: v[0] })}
              className="py-1"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Duration</span>
              <span className="font-mono font-medium text-foreground">{settings.duration}s</span>
            </div>
            <Slider
              value={[settings.duration]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(v) => onSettingsChange({ duration: v[0] })}
              className="py-1"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>FPS</span>
              <span className="font-mono font-medium text-foreground">{settings.fps}</span>
            </div>
            <Slider
              value={[settings.fps]}
              min={24}
              max={60}
              step={6}
              onValueChange={(v) => onSettingsChange({ fps: v[0] })}
              className="py-1"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Font size</span>
              <span className="font-mono font-medium text-foreground">{settings.fontSize}px</span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={48}
              max={300}
              step={12}
              onValueChange={(v) => onSettingsChange({ fontSize: v[0] })}
              className="py-1"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Colors</Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Foreground
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.foregroundColor}
                onChange={(e) =>
                  onSettingsChange({ foregroundColor: e.target.value })
                }
                className="w-10 h-9 p-0.5 bg-secondary border-border cursor-pointer rounded-lg"
              />
              <Input
                type="text"
                value={settings.foregroundColor}
                onChange={(e) =>
                  onSettingsChange({ foregroundColor: e.target.value })
                }
                className="flex-1 h-9 bg-secondary/50 border-border font-mono text-xs"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Background
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.backgroundColor === 'transparent' ? '#000000' : settings.backgroundColor}
                onChange={(e) =>
                  onSettingsChange({ backgroundColor: e.target.value })
                }
                className="w-10 h-9 p-0.5 bg-secondary border-border cursor-pointer rounded-lg"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) =>
                  onSettingsChange({ backgroundColor: e.target.value })
                }
                className="flex-1 h-9 bg-secondary/50 border-border font-mono text-xs"
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seed */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
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
            className="flex-1 bg-secondary/50 border-border font-mono h-9"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={randomizeSeed}
            className="h-9 w-9 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-auto pt-4 border-t border-border space-y-3">
        {/* Render Info */}
        {settings.text.trim() && (
          <div className="flex items-center justify-between">
            <RenderCostBadge 
              cost={renderCost} 
              canAfford={canAfford} 
            />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimatedTime}</span>
            </div>
          </div>
        )}

        {/* Cooldown Timer */}
        {isOnCooldown && (
          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Timer className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-500">
              Cooldown: {cooldownRemaining}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {isExporting && (
          <div className="space-y-2">
            <Progress value={exportProgress * 100} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Rendering... {Math.round(exportProgress * 100)}%
            </p>
          </div>
        )}

        {/* Export Buttons */}
        <Button
          onClick={() => onExport('video')}
          disabled={isExporting || !canExport}
          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Generating...
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
          className="w-full h-10 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
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
