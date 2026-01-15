import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Maximize2, RefreshCw } from 'lucide-react';
import { MatchCutSequence, renderFrameToCanvas, getAspectRatio } from '@/lib/matchcut';
import { cn } from '@/lib/utils';

interface PreviewCanvasProps {
  sequence: MatchCutSequence | null;
  onRegenerate?: () => void;
}

export function PreviewCanvas({ sequence, onRegenerate }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Get aspect ratio dimensions
  const aspectRatio = sequence ? getAspectRatio(sequence.settings.aspectRatio) : { width: 1920, height: 1080, id: '16:9' };
  const aspectClass = useMemo(() => {
    switch (aspectRatio.id) {
      case '9:16': return 'aspect-[9/16]';
      case '1:1': return 'aspect-square';
      case '4:5': return 'aspect-[4/5]';
      default: return 'aspect-video';
    }
  }, [aspectRatio.id]);

  // Reset to first frame when sequence changes
  useEffect(() => {
    setCurrentFrame(0);
    setIsPlaying(false);
  }, [sequence?.seed, sequence?.totalFrames, sequence?.settings.aspectRatio]);

  const renderCurrentFrame = useCallback(() => {
    if (!canvasRef.current || !sequence) return;
    
    const frame = sequence.frames[currentFrame];
    if (!frame) return;

    renderFrameToCanvas(
      canvasRef.current,
      sequence.text,
      frame.fontFamily,
      sequence.settings.fontSize,
      sequence.settings.foregroundColor,
      sequence.settings.backgroundColor
    );
  }, [sequence, currentFrame]);

  useEffect(() => {
    renderCurrentFrame();
  }, [renderCurrentFrame]);

  useEffect(() => {
    if (!isPlaying || !sequence) return;

    const frameDuration = 1000 / sequence.fps;

    const animate = (time: number) => {
      if (time - lastTimeRef.current >= frameDuration) {
        setCurrentFrame((prev) => {
          const next = prev + 1;
          return next >= sequence.totalFrames ? 0 : next;
        });
        lastTimeRef.current = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, sequence]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentFrame(0);
  };

  const handleScrub = (value: number[]) => {
    setIsPlaying(false);
    setCurrentFrame(value[0]);
  };

  // Calculate progress percentage for visual feedback
  const progressPercentage = useMemo(() => {
    if (!sequence || sequence.totalFrames === 0) return 0;
    return ((currentFrame + 1) / sequence.totalFrames) * 100;
  }, [currentFrame, sequence]);

  if (!sequence) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 checkerboard rounded-lg flex items-center justify-center border border-border">
          <div className="text-center text-muted-foreground p-8">
            <Maximize2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-base font-medium mb-2">Enter text to preview your MatchCut</p>
            <p className="text-sm opacity-70">Type or paste your text in the left panel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Preview Area */}
      <div className="flex-1 checkerboard rounded-lg overflow-hidden border border-border relative flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={aspectRatio.width}
          height={aspectRatio.height}
          className={cn("max-w-full max-h-full object-contain", aspectClass)}
        />
        
        {/* Preview-only watermark overlay - prominent to prevent screen recording */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden select-none z-20"
        >
          {/* Main diagonal watermark pattern */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: 'rotate(-25deg) scale(2.5)',
              transformOrigin: 'center center',
            }}
          >
            <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(8, 1fr)' }}>
              {Array.from({ length: 64 }).map((_, i) => (
                <span 
                  key={i} 
                  className="text-white/20 text-sm font-bold whitespace-nowrap tracking-wider drop-shadow-lg"
                  style={{
                    textShadow: '0 0 10px rgba(0,0,0,0.5)',
                  }}
                >
                  MatchCut Maker
                </span>
              ))}
            </div>
          </div>
          
          {/* Center prominent watermark */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="text-white/30 text-4xl font-black tracking-widest"
              style={{
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                transform: 'rotate(-15deg)',
              }}
            >
              PREVIEW ONLY
            </div>
          </div>
          
          {/* Corner watermarks */}
          <div className="absolute top-4 left-4 text-white/25 text-xs font-semibold tracking-wide">
            MatchCut Maker
          </div>
          <div className="absolute top-4 right-4 text-white/25 text-xs font-semibold tracking-wide">
            Export to remove watermark
          </div>
          <div className="absolute bottom-16 left-4 text-white/25 text-xs font-semibold tracking-wide">
            © MatchCut Maker
          </div>
          <div className="absolute bottom-16 right-4 text-white/25 text-xs font-semibold tracking-wide">
            Preview Only
          </div>
        </div>
        
        {/* Font indicator */}
        <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-mono text-foreground shadow-md z-10">
          {sequence.frames[currentFrame]?.fontName}
        </div>

        {/* Frame counter */}
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-mono text-muted-foreground shadow-md z-10">
          {currentFrame + 1} / {sequence.totalFrames}
        </div>
      </div>

      {/* Playback controls */}
      <div className="space-y-3">
        {/* Progress bar */}
        <div className="relative">
          <Slider
            value={[currentFrame]}
            min={0}
            max={Math.max(0, sequence.totalFrames - 1)}
            step={1}
            onValueChange={handleScrub}
            className="cursor-pointer"
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePlayPause}
              className="h-10 w-10 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className="h-10 w-10 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {onRegenerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="h-10 px-3 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50 gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            {sequence.fps} fps • {sequence.settings.duration}s duration
          </div>
        </div>
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground text-center bg-secondary/30 rounded-lg py-2 px-4">
        Tip: Use 1–2 frames per card for a punchy look. Change the seed for different font sequences.
      </p>
    </div>
  );
}
