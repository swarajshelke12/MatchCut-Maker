import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PRESETS, PresetKey } from '@/lib/fonts';
import { Sparkles, Upload, Type } from 'lucide-react';

interface InputPanelProps {
  text: string;
  onTextChange: (text: string) => void;
  onPresetSelect: (preset: PresetKey) => void;
  selectedPreset: PresetKey | null;
}

export function InputPanel({ text, onTextChange, onPresetSelect, selectedPreset }: InputPanelProps) {
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
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="KEEP GOING"
          className="h-32 resize-none bg-secondary/30 border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/50 font-mono text-lg rounded-xl"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {text.length} / 200 characters
        </p>
      </div>

      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Quick Presets
        </Label>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant={selectedPreset === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPresetSelect(key as PresetKey)}
              className={`justify-start text-left h-auto py-2.5 px-3 rounded-lg ${
                selectedPreset === key 
                  ? 'bg-primary text-primary-foreground shadow-glow' 
                  : 'bg-secondary/30 border-border hover:bg-secondary hover:border-primary/50'
              }`}
            >
              <div>
                <div className="font-medium text-sm">{preset.name}</div>
                <div className="text-xs opacity-70">
                  {preset.framesPerCard}f @ {preset.fps}fps • {preset.duration}s
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-secondary/20 border-border hover:bg-secondary hover:border-primary/50 rounded-lg"
          disabled
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload .txt (coming soon)
        </Button>
      </div>
    </div>
  );
}
