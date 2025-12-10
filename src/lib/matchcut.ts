import { CURATED_FONTS, shuffleFonts } from './fonts';

// Aspect ratio definitions
export type AspectRatioId = '16:9' | '9:16' | '1:1' | '4:5';

export interface AspectRatioPreset {
  id: AspectRatioId;
  label: string;
  width: number;
  height: number;
}

export const ASPECT_RATIOS: AspectRatioPreset[] = [
  { id: '16:9', label: 'Landscape (1920×1080)', width: 1920, height: 1080 },
  { id: '9:16', label: 'Vertical (1080×1920)', width: 1080, height: 1920 },
  { id: '1:1', label: 'Square (1080×1080)', width: 1080, height: 1080 },
  { id: '4:5', label: 'Portrait (1080×1350)', width: 1080, height: 1350 },
];

export function getAspectRatio(id: AspectRatioId): AspectRatioPreset {
  return ASPECT_RATIOS.find(ar => ar.id === id) || ASPECT_RATIOS[0];
}

export interface MatchCutSettings {
  text: string;
  fps: number;
  duration: number;
  framesPerCard: number;
  selectedFonts: string[];
  foregroundColor: string;
  backgroundColor: string;
  fontSize: number;
  seed: number;
  aspectRatio: AspectRatioId;
}

export interface FrameData {
  frameNumber: number;
  fontName: string;
  fontFamily: string;
  durationMs: number;
}

export interface MatchCutSequence {
  text: string;
  fps: number;
  totalFrames: number;
  seed: number;
  settings: MatchCutSettings;
  frames: FrameData[];
}

export function generateSequence(settings: MatchCutSettings): MatchCutSequence {
  const totalFrames = Math.floor(settings.fps * settings.duration);
  const cardChanges = Math.ceil(totalFrames / settings.framesPerCard);
  
  const fontFamilies = settings.selectedFonts.length > 0 
    ? settings.selectedFonts 
    : CURATED_FONTS.map(f => f.name);
  
  const shuffledFonts = shuffleFonts(fontFamilies, settings.seed, cardChanges);
  
  const frames: FrameData[] = [];
  let fontIndex = 0;
  
  for (let i = 0; i < totalFrames; i++) {
    if (i > 0 && i % settings.framesPerCard === 0) {
      fontIndex++;
    }
    
    const fontName = shuffledFonts[fontIndex % shuffledFonts.length];
    const font = CURATED_FONTS.find(f => f.name === fontName);
    
    frames.push({
      frameNumber: i + 1,
      fontName,
      fontFamily: font?.family || `'${fontName}', sans-serif`,
      durationMs: 1000 / settings.fps,
    });
  }
  
  return {
    text: settings.text,
    fps: settings.fps,
    totalFrames,
    seed: settings.seed,
    settings,
    frames,
  };
}

export function renderFrameToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  fontFamily: string,
  fontSize: number,
  fgColor: string,
  bgColor: string
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear with background (or transparent if no bg)
  if (bgColor === 'transparent') {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Draw text with safe area padding (10% on each side)
  const safeAreaPadding = 0.1;
  const safeWidth = canvas.width * (1 - safeAreaPadding * 2);
  const safeHeight = canvas.height * (1 - safeAreaPadding * 2);
  
  ctx.fillStyle = fgColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap within safe area
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Auto-fit font size within safe area
  let adjustedFontSize = fontSize;
  ctx.font = `bold ${adjustedFontSize}px ${fontFamily}`;
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > safeWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  const lineHeight = adjustedFontSize * 1.2;
  let totalHeight = lines.length * lineHeight;
  
  // Scale down if text doesn't fit in safe height
  if (totalHeight > safeHeight) {
    const scale = safeHeight / totalHeight;
    adjustedFontSize = Math.floor(adjustedFontSize * scale);
    ctx.font = `bold ${adjustedFontSize}px ${fontFamily}`;
  }
  
  const finalLineHeight = adjustedFontSize * 1.2;
  const finalTotalHeight = lines.length * finalLineHeight;
  const startY = (canvas.height - finalTotalHeight) / 2 + finalLineHeight / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * finalLineHeight);
  });
}

// Sleep helper for frame timing
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function exportAsVideo(
  sequence: MatchCutSequence,
  canvas: HTMLCanvasElement,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const { frames, settings } = sequence;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Use a higher bitrate for quality
  const stream = canvas.captureStream(settings.fps);
  
  // Try VP9 with alpha first, fallback to VP8
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm;codecs=vp8';
  }
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 10000000, // 10 Mbps for high quality
  });

  const chunks: Blob[] = [];
  
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
    recorder.onerror = (e) => reject(e);
  });

  // Start recording
  recorder.start();

  // Render each frame with proper timing
  const frameDuration = 1000 / settings.fps;
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    
    // Render the frame
    renderFrameToCanvas(
      canvas,
      sequence.text,
      frame.fontFamily,
      settings.fontSize,
      settings.foregroundColor,
      settings.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : settings.backgroundColor
    );
    
    // Wait for the frame duration
    await sleep(frameDuration);
    
    if (onProgress) {
      onProgress((i + 1) / frames.length);
    }
  }

  // Stop recording
  recorder.stop();

  return recordingPromise;
}

export async function exportSequenceAsPngs(
  sequence: MatchCutSequence,
  canvas: HTMLCanvasElement,
  onProgress?: (progress: number) => void
): Promise<{ pngs: { name: string; blob: Blob }[]; json: string }> {
  const pngs: { name: string; blob: Blob }[] = [];
  const { text, frames, settings } = sequence;
  
  const sanitizedText = text.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
  
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    
    renderFrameToCanvas(
      canvas,
      text,
      frame.fontFamily,
      settings.fontSize,
      settings.foregroundColor,
      'transparent'
    );
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    
    const paddedFrame = String(frame.frameNumber).padStart(4, '0');
    const safeFontName = frame.fontName.replace(/\s+/g, '-');
    pngs.push({
      name: `${sanitizedText}_${paddedFrame}_${safeFontName}.png`,
      blob,
    });
    
    if (onProgress) {
      onProgress((i + 1) / frames.length);
    }
  }
  
  const aspectRatio = getAspectRatio(settings.aspectRatio);
  
  const jsonData = {
    text: sequence.text,
    fps: sequence.fps,
    aspectRatio: settings.aspectRatio,
    width: aspectRatio.width,
    height: aspectRatio.height,
    totalFrames: sequence.totalFrames,
    seed: sequence.seed,
    settings: {
      framesPerCard: settings.framesPerCard,
      duration: settings.duration,
      fontSize: settings.fontSize,
      foregroundColor: settings.foregroundColor,
      backgroundColor: settings.backgroundColor,
      aspectRatio: settings.aspectRatio,
    },
    frames: frames.map((f, i) => ({
      frameNumber: f.frameNumber,
      fontName: f.fontName,
      filename: pngs[i].name,
      durationMs: f.durationMs,
    })),
  };
  
  return {
    pngs,
    json: JSON.stringify(jsonData, null, 2),
  };
}
