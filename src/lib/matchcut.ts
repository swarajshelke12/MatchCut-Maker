import { CURATED_FONTS, shuffleFonts } from './fonts';

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
  // Newspaper style effects
  grainOverlay?: boolean;
  scaleJitter?: { min: number; max: number };
  rotationJitter?: { min: number; max: number };
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
  bgColor: string,
  options?: {
    scaleJitter?: { min: number; max: number };
    rotationJitter?: { min: number; max: number };
    grainOverlay?: boolean;
    frameIndex?: number;
  }
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

  // Save context for transforms
  ctx.save();

  // Apply jitter effects if specified
  if (options?.scaleJitter || options?.rotationJitter) {
    const frameIndex = options.frameIndex || 0;
    const seed = frameIndex * 7919; // Prime for randomness
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    if (options.rotationJitter) {
      const range = options.rotationJitter.max - options.rotationJitter.min;
      const rotation = options.rotationJitter.min + (((seed % 1000) / 1000) * range);
      ctx.rotate((rotation * Math.PI) / 180);
    }
    
    if (options.scaleJitter) {
      const range = options.scaleJitter.max - options.scaleJitter.min;
      const scale = options.scaleJitter.min + (((seed * 3 % 1000) / 1000) * range);
      ctx.scale(scale, scale);
    }
    
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }
  
  // Draw text
  ctx.fillStyle = fgColor;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Word wrap if needed
  const words = text.split(' ');
  const maxWidth = canvas.width * 0.9;
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  const lineHeight = fontSize * 1.2;
  const totalHeight = lines.length * lineHeight;
  const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
  });

  ctx.restore();

  // Apply grain overlay effect
  if (options?.grainOverlay) {
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.globalCompositeOperation = 'multiply';
    
    // Simple noise pattern
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const frameIndex = options.frameIndex || 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 40 - 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    ctx.putImageData(imageData, 0, 0);
    ctx.restore();
  }
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
    
    // Render the frame with style effects
    renderFrameToCanvas(
      canvas,
      sequence.text,
      frame.fontFamily,
      settings.fontSize,
      settings.foregroundColor,
      settings.backgroundColor === 'transparent' ? 'rgba(0,0,0,0)' : settings.backgroundColor,
      {
        scaleJitter: settings.scaleJitter,
        rotationJitter: settings.rotationJitter,
        grainOverlay: settings.grainOverlay,
        frameIndex: i,
      }
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
      'transparent',
      {
        scaleJitter: settings.scaleJitter,
        rotationJitter: settings.rotationJitter,
        grainOverlay: settings.grainOverlay,
        frameIndex: i,
      }
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
  
  const jsonData = {
    text: sequence.text,
    fps: sequence.fps,
    totalFrames: sequence.totalFrames,
    seed: sequence.seed,
    settings: {
      framesPerCard: settings.framesPerCard,
      duration: settings.duration,
      fontSize: settings.fontSize,
      foregroundColor: settings.foregroundColor,
      backgroundColor: settings.backgroundColor,
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
