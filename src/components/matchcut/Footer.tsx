import { FileJson, Image, Info, Video } from 'lucide-react';

interface FooterProps {
  lastExport: { filename: string; frames: number; format: string } | null;
}

export function Footer({ lastExport }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            {lastExport ? (
              <>
                <span className="flex items-center gap-1.5">
                  {lastExport.format === 'WebM' ? (
                    <Video className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Image className="w-3.5 h-3.5 text-primary" />
                  )}
                  {lastExport.frames} frames as {lastExport.format}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileJson className="w-3.5 h-3.5 text-primary" />
                  {lastExport.filename}_matchcut.{lastExport.format === 'WebM' ? 'webm' : 'zip'}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Enter text and click "Export Video" to download
              </span>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-muted-foreground">
            <span>WebM: Drag & drop into any editor</span>
            <span>•</span>
            <span>Supports Premiere, After Effects, DaVinci, Final Cut</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
