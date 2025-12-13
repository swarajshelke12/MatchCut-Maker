import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PRESETS, PresetKey, CURATED_FONTS, shuffleFonts } from '@/lib/fonts';
import { Type, X, Shuffle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface InputPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  onPresetSelect: (preset: PresetKey) => void;
  selectedPreset: PresetKey | null;
  onCustomFontsSelect?: (fonts: string[]) => void;
}

const MAX_TEXT_LENGTH = 50;

const MAX_CUSTOM_FONTS = CURATED_FONTS.length;
const MIN_CUSTOM_FONTS = 3;

export function InputPanel({ text, onTextChange, onPresetSelect, selectedPreset, onCustomFontsSelect }: InputPanelProps) {
  const [customFontCount, setCustomFontCount] = useState<string>('20');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const handleTextChange = (value: string) => {
    if (value.length <= MAX_TEXT_LENGTH) {
      onTextChange(value);
    }
  };

  const handlePresetChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomMode(true);
      generateCustomFonts();
    } else {
      setIsCustomMode(false);
      onPresetSelect(value as PresetKey);
    }
  };

  const generateCustomFonts = () => {
    const count = Math.max(MIN_CUSTOM_FONTS, Math.min(MAX_CUSTOM_FONTS, parseInt(customFontCount) || 20));
    const allFontNames = CURATED_FONTS.map(f => f.name);
    const seed = Date.now();
    const randomFonts = shuffleFonts(allFontNames, seed, count);
    // Remove duplicates while preserving order
    const uniqueFonts = [...new Set(randomFonts)];
    onCustomFontsSelect?.(uniqueFonts);
  };

  const handleCustomCountChange = (value: string) => {
    setCustomFontCount(value);
  };

  const handleCustomCountBlur = () => {
    const num = parseInt(customFontCount) || 20;
    const clamped = Math.max(MIN_CUSTOM_FONTS, Math.min(MAX_CUSTOM_FONTS, num));
    setCustomFontCount(clamped.toString());
    if (isCustomMode) {
      generateCustomFonts();
    }
  };

  const getCounterColor = () => {
    if (text.length >= 48) return 'text-destructive';
    if (text.length >= 40) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary" />
          Input Text
        </h2>
        <p className="text-sm text-muted-foreground">
          Paste your text — keep it short for maximum impact.
        </p>
      </div>

      <div className="flex-1">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="KEEP GOING"
            maxLength={MAX_TEXT_LENGTH}
            className="h-32 resize-none bg-secondary/30 border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/50 font-mono text-lg rounded-xl pr-10"
          />
          {text.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onTextChange('')}
              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className={`text-xs mt-2 transition-colors ${getCounterColor()}`}>
          {text.length} / {MAX_TEXT_LENGTH} characters
        </p>
      </div>

      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block">
          Font Pool
        </Label>
        <Select
          value={isCustomMode ? 'custom' : (selectedPreset || undefined)}
          onValueChange={handlePresetChange}
        >
          <SelectTrigger className="w-full bg-secondary/30 border-border">
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key} className="cursor-pointer">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{preset.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {preset.framesPerCard}f @ {preset.fps}fps • {preset.duration}s
                  </span>
                </div>
              </SelectItem>
            ))}
            <SelectItem value="custom" className="cursor-pointer">
              <div className="flex flex-col items-start">
                <span className="font-medium">Custom Random</span>
                <span className="text-xs text-muted-foreground">
                  Pick your own font count
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {isCustomMode && (
          <div className="mt-3 p-3 bg-secondary/20 rounded-lg border border-border space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-muted-foreground whitespace-nowrap">
                Number of fonts:
              </Label>
              <Input
                type="number"
                min={MIN_CUSTOM_FONTS}
                max={MAX_CUSTOM_FONTS}
                value={customFontCount}
                onChange={(e) => handleCustomCountChange(e.target.value)}
                onBlur={handleCustomCountBlur}
                className="h-8 w-20 text-center bg-background/50"
              />
              <span className="text-xs text-muted-foreground">
                (max {MAX_CUSTOM_FONTS})
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateCustomFonts}
              className="w-full"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle Fonts
            </Button>
          </div>
        )}
      </div>

    </div>
  );
}
