import { FileJson, ImageIcon, Info, Video, CheckCircle2, Scissors, Github, Heart } from 'lucide-react';

interface FooterProps {
  lastExport: { filename: string; frames: number; format: string } | null;
}

export function Footer({ lastExport }: FooterProps) {
  return (
    <footer className="border-t border-border/40 glass-panel rounded-none">
      {/* Subtle top gradient accent */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          {/* Left: Export Status */}
          <div className="flex items-center gap-4 text-muted-foreground">
            {lastExport ? (
              <>
                <span className="flex items-center gap-1.5 text-foreground/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">Last export:</span>
                </span>
                <span className="flex items-center gap-1.5">
                  {lastExport.format === 'WebM' ? (
                    <Video className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  )}
                  <span className="font-medium text-foreground/80">{lastExport.frames} frames</span>
                  <span className="text-border">·</span>
                  <span>{lastExport.format}</span>
                </span>
                <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] opacity-70">
                  <FileJson className="w-3.5 h-3.5 text-primary" />
                  {lastExport.filename}_matchcut.{lastExport.format === 'WebM' ? 'webm' : 'zip'}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground/70">
                <Info className="w-3.5 h-3.5" />
                Enter text and export to download your sequence
              </span>
            )}
          </div>

          {/* Right: Branding */}
          <div className="flex items-center gap-3 text-muted-foreground/60">
            <span className="hidden md:flex items-center gap-1 text-[11px]">
              <Scissors className="w-3 h-3 text-primary/60" />
              <span className="gradient-text-primary font-semibold">MatchCut Maker</span>
            </span>
            <span className="hidden lg:inline text-[11px] opacity-60">
              WebM · drag &amp; drop into any editor
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
