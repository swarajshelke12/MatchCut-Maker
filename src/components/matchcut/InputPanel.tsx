import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PRESETS, PresetKey } from '@/lib/fonts';
import { Type, Upload } from 'lucide-react';
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
}

const MAX_TEXT_LENGTH = 50;

export function InputPanel({ text, onTextChange, onPresetSelect, selectedPreset }: InputPanelProps) {
  const handleTextChange = (value: string) => {
    if (value.length <= MAX_TEXT_LENGTH) {
      onTextChange(value);
    }
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
        <Textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="KEEP GOING"
          maxLength={MAX_TEXT_LENGTH}
          className="h-32 resize-none bg-secondary/30 border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/50 font-mono text-lg rounded-xl"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {text.length} / {MAX_TEXT_LENGTH} characters
        </p>
      </div>

      <div>
        <Label className="text-sm font-semibold text-foreground mb-3 block">
          Quick Presets
        </Label>
        <Select
          value={selectedPreset || undefined}
          onValueChange={(value) => onPresetSelect(value as PresetKey)}
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
          </SelectContent>
        </Select>
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
