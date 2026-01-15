import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Header } from '@/components/matchcut/Header';
import { Footer } from '@/components/matchcut/Footer';
import { InputPanel } from '@/components/matchcut/InputPanel';
import { PreviewCanvas } from '@/components/matchcut/PreviewCanvas';
import { ControlPanel, ExportFormat } from '@/components/matchcut/ControlPanel';
import { InsufficientCreditsDialog } from '@/components/credits/InsufficientCreditsDialog';
import { OnboardingDialog, useOnboarding } from '@/components/onboarding/OnboardingDialog';
import { PRESETS, PresetKey, DEFAULT_IMPACT_FONTS } from '@/lib/fonts';
import { ANIMATION_STYLES, getAnimationStyle } from '@/lib/animationStyles';
import { MatchCutSettings, generateSequence, exportAsVideo, exportSequenceAsPngs, MatchCutSequence, getAspectRatio } from '@/lib/matchcut';
import { useCredits } from '@/hooks/use-credits';
import { useCooldown } from '@/hooks/use-cooldown';
import { toast } from 'sonner';

const DEFAULT_SETTINGS: MatchCutSettings = {
  text: '',
  fps: 60,
  duration: 2,
  framesPerCard: 1,
  selectedFonts: DEFAULT_IMPACT_FONTS,
  foregroundColor: '#ffffff',
  backgroundColor: 'auto',
  fontSize: 180,
  seed: 42,
  aspectRatio: '16:9',
};

const Index = () => {
  const [settings, setSettings] = useState<MatchCutSettings>(DEFAULT_SETTINGS);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);
  const [selectedAnimationStyle, setSelectedAnimationStyle] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [lastExport, setLastExport] = useState<{ filename: string; frames: number; format: string } | null>(null);
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);
  const [insufficientReason, setInsufficientReason] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  // Credit system hook
  const credits = useCredits();
  
  // Cooldown hook
  const cooldown = useCooldown();
  
  // Onboarding hook
  const { shouldShow: shouldShowOnboarding } = useOnboarding();

  // Show onboarding for new users
  useEffect(() => {
    if (credits.isNewUser && shouldShowOnboarding && !credits.isLoading) {
      setShowOnboarding(true);
      toast.success('Welcome! You received 500 Bonus Credits.', {
        duration: 5000,
        icon: '🎉',
      });
    }
  }, [credits.isNewUser, credits.isLoading, shouldShowOnboarding]);

  // Show low credit warning
  useEffect(() => {
    if (credits.isLoading) return;
    
    if (credits.isBonusLow) {
      toast.warning('Bonus credits running low! Less than 20% remaining.', {
        duration: 4000,
        id: 'low-bonus-credits',
      });
    }
    if (credits.isMonthlyLow) {
      toast.warning('Monthly credits running low! Less than 20% remaining.', {
        duration: 4000,
        id: 'low-monthly-credits',
      });
    }
  }, [credits.isLoading, credits.isBonusLow, credits.isMonthlyLow]);

  const sequence: MatchCutSequence | null = useMemo(() => {
    if (!settings.text.trim()) return null;
    return generateSequence(settings);
  }, [settings]);

  // Calculate render cost based on current settings
  const renderCost = useMemo(() => {
    const numFonts = settings.selectedFonts.length || 1;
    return credits.getRenderCost(numFonts, settings.duration, settings.fps);
  }, [settings, credits]);

  // Check if user can afford the render
  const affordCheck = useMemo(() => {
    return credits.checkCanRender(renderCost.total);
  }, [credits, renderCost]);

  const handleSettingsChange = useCallback((newSettings: Partial<MatchCutSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (selectedPreset && !('text' in newSettings)) {
      setSelectedPreset(null);
    }
    // Clear animation style if user manually changes settings
    if (selectedAnimationStyle && !('text' in newSettings)) {
      // Don't clear if only text changed
      const styleKeys = ['fps', 'duration', 'framesPerCard', 'selectedFonts', 'foregroundColor', 'backgroundColor'];
      if (Object.keys(newSettings).some(key => styleKeys.includes(key))) {
        setSelectedAnimationStyle(null);
      }
    }
  }, [selectedPreset, selectedAnimationStyle]);

  const handlePresetSelect = useCallback((presetKey: PresetKey) => {
    const preset = PRESETS[presetKey];
    setSelectedPreset(presetKey);
    setSelectedAnimationStyle(null);
    setSettings((prev) => ({
      ...prev,
      fps: preset.fps,
      duration: preset.duration,
      framesPerCard: preset.framesPerCard,
      selectedFonts: preset.fonts,
    }));
  }, []);

  const handleCustomFontsSelect = useCallback((fonts: string[]) => {
    setSelectedPreset(null);
    setSelectedAnimationStyle(null);
    setSettings((prev) => ({
      ...prev,
      selectedFonts: fonts,
    }));
  }, []);

  const handleAnimationStyleChange = useCallback((styleId: string) => {
    const style = getAnimationStyle(styleId);
    if (!style) return;
    
    setSelectedAnimationStyle(styleId);
    setSelectedPreset(null);
    setSettings((prev) => ({
      ...prev,
      fps: style.fps,
      duration: style.duration,
      framesPerCard: style.framesPerCard,
      selectedFonts: style.fonts,
      foregroundColor: style.foregroundColor,
      backgroundColor: style.backgroundColor,
    }));
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
    credits.completeOnboarding();
  }, [credits]);

  const handleRegeneratePreview = useCallback(() => {
    // Just randomize the seed to regenerate
    setSettings((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 999999),
    }));
  }, []);

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!sequence || !exportCanvasRef.current) return;

    // Check cooldown first
    if (cooldown.isOnCooldown) {
      toast.error(`Please wait ${cooldown.formatCooldown} before rendering again.`);
      return;
    }

    // Check credits before starting
    if (!affordCheck.canRender) {
      setInsufficientReason(affordCheck.reason || 'Insufficient credits');
      setShowInsufficientDialog(true);
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    const sanitizedText = settings.text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
    const costToDeduct = renderCost.total;

    try {
      if (format === 'video') {
        toast.info('Recording video... This may take a moment.');
        
        const videoBlob = await exportAsVideo(
          sequence,
          exportCanvasRef.current,
          setExportProgress
        );

        saveAs(videoBlob, `${sanitizedText}_matchcut.webm`);
        setLastExport({ filename: sanitizedText, frames: sequence.totalFrames, format: 'WebM' });
        
        // Deduct credits and start cooldown after successful export
        credits.deductRenderCredits(costToDeduct);
        cooldown.startCooldown();
        toast.success(`Video exported! (${costToDeduct} credits used)`);
      } else {
        const { pngs, json } = await exportSequenceAsPngs(
          sequence,
          exportCanvasRef.current,
          setExportProgress
        );

        const zip = new JSZip();
        const folder = zip.folder(sanitizedText);

        if (folder) {
          const framesFolder = folder.folder('frames');
          for (const png of pngs) {
            framesFolder?.file(png.name, png.blob);
          }
          folder.file(`${sanitizedText}_timing.json`, json);
          
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

        setLastExport({ filename: sanitizedText, frames: pngs.length, format: 'PNG' });
        
        // Deduct credits and start cooldown after successful export
        credits.deductRenderCredits(costToDeduct);
        cooldown.startCooldown();
        toast.success(`Exported ${pngs.length} frames! (${costToDeduct} credits used)`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Refund credits on failure
      credits.refundCredits(costToDeduct);
      toast.error('Export failed. Credits have been refunded.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [sequence, settings, credits, renderCost, affordCheck]);

  if (credits.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading MatchCut Maker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[300px_1fr_360px] gap-4 lg:gap-6">
        {/* Left Panel - Input */}
        <aside className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in">
          <InputPanel
            text={settings.text}
            onTextChange={(text) => handleSettingsChange({ text })}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
            onCustomFontsSelect={handleCustomFontsSelect}
          />
        </aside>

        {/* Center - Preview */}
        <section className="bg-card rounded-xl border border-border p-5 shadow-card min-h-[400px] lg:min-h-0 animate-fade-in">
          <PreviewCanvas 
            sequence={sequence} 
            onRegenerate={handleRegeneratePreview}
          />
        </section>

        {/* Right Panel - Controls */}
        <aside className="bg-card rounded-xl border border-border p-5 shadow-card animate-fade-in overflow-y-auto max-h-[calc(100vh-140px)]">
          <ControlPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onExport={handleExport}
            isExporting={isExporting}
            exportProgress={exportProgress}
            bonusCredits={credits.bonusCredits}
            monthlyCredits={credits.monthlyCredits}
            remainingDaily={credits.remainingDaily}
            purchasedCredits={credits.purchasedCredits}
            bonusColor={credits.bonusColor}
            monthlyColor={credits.monthlyColor}
            dailyColor={credits.dailyColor}
            creditResetDate={credits.creditData?.creditResetDate}
            renderCost={renderCost}
            canAfford={affordCheck.canRender}
            
            selectedAnimationStyle={selectedAnimationStyle}
            onAnimationStyleChange={handleAnimationStyleChange}
            totalFrames={sequence?.totalFrames || Math.ceil(settings.fps * settings.duration)}
            fps={settings.fps}
            isOnCooldown={cooldown.isOnCooldown}
            cooldownRemaining={cooldown.formatCooldown}
          />
        </aside>
      </main>

      <Footer lastExport={lastExport} />

      {/* Hidden canvas for export - dynamically sized based on aspect ratio */}
      <canvas
        ref={exportCanvasRef}
        width={getAspectRatio(settings.aspectRatio).width}
        height={getAspectRatio(settings.aspectRatio).height}
        className="hidden"
      />

      {/* Onboarding Dialog */}
      <OnboardingDialog
        open={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Insufficient Credits Dialog */}
      <InsufficientCreditsDialog
        open={showInsufficientDialog}
        onOpenChange={setShowInsufficientDialog}
        reason={insufficientReason}
      />
    </div>
  );
};

export default Index;
