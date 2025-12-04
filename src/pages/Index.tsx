import { useState, useCallback, useRef, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Header } from '@/components/matchcut/Header';
import { Footer } from '@/components/matchcut/Footer';
import { InputPanel } from '@/components/matchcut/InputPanel';
import { PreviewCanvas } from '@/components/matchcut/PreviewCanvas';
import { ControlPanel } from '@/components/matchcut/ControlPanel';
import { PRESETS, PresetKey } from '@/lib/fonts';
import { MatchCutSettings, generateSequence, exportSequence, MatchCutSequence } from '@/lib/matchcut';
import { toast } from 'sonner';

const DEFAULT_SETTINGS: MatchCutSettings = {
  text: '',
  fps: 30,
  duration: 3,
  framesPerCard: 2,
  selectedFonts: [],
  foregroundColor: '#ffffff',
  backgroundColor: '#000000',
  fontSize: 180,
  seed: 42,
};

const Index = () => {
  const [settings, setSettings] = useState<MatchCutSettings>(DEFAULT_SETTINGS);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<{ filename: string; frames: number } | null>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  const sequence: MatchCutSequence | null = useMemo(() => {
    if (!settings.text.trim()) return null;
    return generateSequence(settings);
  }, [settings]);

  const handleSettingsChange = useCallback((newSettings: Partial<MatchCutSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (selectedPreset && !('text' in newSettings)) {
      setSelectedPreset(null);
    }
  }, [selectedPreset]);

  const handlePresetSelect = useCallback((presetKey: PresetKey) => {
    const preset = PRESETS[presetKey];
    setSelectedPreset(presetKey);
    setSettings((prev) => ({
      ...prev,
      fps: preset.fps,
      duration: preset.duration,
      framesPerCard: preset.framesPerCard,
      selectedFonts: preset.fonts,
    }));
  }, []);

  const handleExport = useCallback(async () => {
    if (!sequence || !exportCanvasRef.current) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const { pngs, json } = await exportSequence(
        sequence,
        exportCanvasRef.current,
        setExportProgress
      );

      const zip = new JSZip();
      const sanitizedText = settings.text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
      const folder = zip.folder(sanitizedText);

      if (folder) {
        const framesFolder = folder.folder('frames');
        for (const png of pngs) {
          framesFolder?.file(png.name, png.blob);
        }
        folder.file(`${sanitizedText}_timing.json`, json);
        
        // Add readme
        const readme = `# MatchCut Export: ${settings.text}

## Contents
- /frames/ - PNG sequence with alpha channel
- ${sanitizedText}_timing.json - Frame timing and font metadata

## Import Instructions

### Adobe Premiere Pro
1. File → Import
2. Select the first PNG in /frames/
3. Check "Image Sequence" at the bottom
4. Set frame rate to ${settings.fps} fps

### After Effects
1. File → Import → File
2. Select the first PNG
3. Check "PNG Sequence"
4. Set frame rate to ${settings.fps} fps

### DaVinci Resolve
1. File → Import → Media
2. Navigate to /frames/ folder
3. Right-click → Import Image Sequence

## Settings Used
- FPS: ${settings.fps}
- Duration: ${settings.duration}s
- Frames per card: ${settings.framesPerCard}
- Total frames: ${sequence.totalFrames}
- Seed: ${settings.seed}
`;
        folder.file('README.md', readme);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${sanitizedText}_matchcut.zip`);

      setLastExport({ filename: sanitizedText, frames: pngs.length });
      toast.success(`Exported ${pngs.length} frames successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [sequence, settings]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4 lg:gap-6">
        {/* Left Panel - Input */}
        <aside className="bg-card rounded-xl border border-border p-4 shadow-card animate-fade-in">
          <InputPanel
            text={settings.text}
            onTextChange={(text) => handleSettingsChange({ text })}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
          />
        </aside>

        {/* Center - Preview */}
        <section className="bg-card rounded-xl border border-border p-4 shadow-card min-h-[400px] lg:min-h-0 animate-fade-in">
          <PreviewCanvas sequence={sequence} />
        </section>

        {/* Right Panel - Controls */}
        <aside className="bg-card rounded-xl border border-border p-4 shadow-card animate-fade-in">
          <ControlPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onExport={handleExport}
            isExporting={isExporting}
            exportProgress={exportProgress}
          />
        </aside>
      </main>

      <Footer lastExport={lastExport} />

      {/* Hidden canvas for export */}
      <canvas
        ref={exportCanvasRef}
        width={1920}
        height={1080}
        className="hidden"
      />
    </div>
  );
};

export default Index;
