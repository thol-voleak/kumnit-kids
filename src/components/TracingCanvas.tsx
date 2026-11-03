import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Play, Volume2, CheckCircle, Award } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { LetterItem, NumberItem } from '../types/curriculum';

interface TracingCanvasProps {
  item: LetterItem | NumberItem;
  language: 'km' | 'en';
  onComplete: (itemId: string) => void;
  onNext?: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({
  item,
  language,
  onComplete,
  onNext,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [visitedGuideIndices, setVisitedGuideIndices] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<SparkleParticle[]>([]);
  const [strokeColor, setStrokeColor] = useState('#F59E0B'); // Warm amber by default
  const [isDemonstrating, setIsDemonstrating] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0); // 0 to 1

  const guidePoints = item.guidePoints;
  const toleranceRadius = 45; // Generous child-friendly tolerance (3-6 years)

  // Reset state on item change
  useEffect(() => {
    setDrawnPoints([]);
    setVisitedGuideIndices(new Set());
    setIsCompleted(false);
    setNudgeMessage(null);
    triggerGuideDemonstration();
  }, [item]);

  // Demonstrate guided stroke animation
  const triggerGuideDemonstration = useCallback(() => {
    setIsDemonstrating(true);
    setDemoProgress(0);
    const startTime = performance.now();
    const duration = 2200; // 2.2 seconds smooth trace

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDemoProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => setIsDemonstrating(false), 300);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Calculate distance between two points
  const getDistance = (p1: Point, p2: Point) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // Convert client coordinates to canvas coordinate space (300x300 internal)
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = 300 / rect.width;
    const scaleY = 300 / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Handle start drawing
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCompleted) return;
    const pt = getCanvasCoordinates(e);
    if (!pt) return;

    setIsDrawing(true);
    setNudgeMessage(null);
    processDrawnPoint(pt);
  };

  // Add sparkle effect
  const addSparkle = (x: number, y: number) => {
    const newSparkle: SparkleParticle = {
      id: Math.random(),
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 20 - 10),
      color: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'][Math.floor(Math.random() * 5)],
      size: Math.random() * 10 + 6,
    };
    setSparkles((prev) => [...prev.slice(-15), newSparkle]);
  };

  // Check point against guide path
  const processDrawnPoint = (pt: Point) => {
    setDrawnPoints((prev) => [...prev, pt]);

    // Find closest guide point
    let minDistance = Infinity;
    let closestIndex = -1;

    guidePoints.forEach((gPt, index) => {
      const d = getDistance(pt, gPt);
      if (d < minDistance) {
        minDistance = d;
        closestIndex = index;
      }
    });

    if (minDistance <= toleranceRadius && closestIndex !== -1) {
      setVisitedGuideIndices((prev) => {
        const next = new Set(prev);
        next.add(closestIndex);

        // Sound chime with rising pitch
        soundEffects.playTraceSparkle(next.size / guidePoints.length);
        addSparkle(pt.x, pt.y);

        // Check if finished (80% of guide points covered in order)
        if (next.size >= Math.ceil(guidePoints.length * 0.8) && !isCompleted) {
          triggerSuccess();
        }

        return next;
      });
    } else if (minDistance > toleranceRadius * 1.6) {
      // Wandered off path - gentle encouragement
      soundEffects.playEncouragingNudge();
      setNudgeMessage(
        language === 'km'
          ? 'ព្យាយាមម្តងទៀតណា កូនពូកែ! គូសតាមបន្ទាត់!'
          : 'Almost there superstar! Follow the dots!'
      );
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isCompleted) return;
    const pt = getCanvasCoordinates(e);
    if (!pt) return;
    processDrawnPoint(pt);
  };

  const handleEnd = () => {
    setIsDrawing(false);
  };

  const triggerSuccess = () => {
    setIsCompleted(true);
    soundEffects.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FBBF24'],
    });
    const id = 'id' in item ? item.id : `num-${item.number}`;
    onComplete(id);
  };

  const handleClear = () => {
    setDrawnPoints([]);
    setVisitedGuideIndices(new Set());
    setIsCompleted(false);
    setNudgeMessage(null);
    soundEffects.playPop();
  };

  const playItemSound = () => {
    soundEffects.playPop();
    if ('char' in item) {
      const textToSpeak = language === 'km' ? item.nameKm : item.nameEn;
      soundEffects.speak(textToSpeak, language);
    } else {
      const textToSpeak = language === 'km' ? item.khmerWord : item.englishWord;
      soundEffects.speak(textToSpeak, language);
    }
  };

  // Render canvas elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 300, 300);

    // Draw background grid dots for playful paper feel
    ctx.fillStyle = '#F3F4F6';
    for (let x = 20; x < 300; x += 30) {
      for (let y = 20; y < 300; y += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw user drawn stroke with smooth rounded caps
    if (drawnPoints.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);

      for (let i = 1; i < drawnPoints.length; i++) {
        const xc = (drawnPoints[i].x + drawnPoints[i - 1].x) / 2;
        const yc = (drawnPoints[i].y + drawnPoints[i - 1].y) / 2;
        ctx.quadraticCurveTo(drawnPoints[i - 1].x, drawnPoints[i - 1].y, xc, yc);
      }
      ctx.stroke();

      // Inner highlight for 3D marker effect
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 8;
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      for (let i = 1; i < drawnPoints.length; i++) {
        const xc = (drawnPoints[i].x + drawnPoints[i - 1].x) / 2;
        const yc = (drawnPoints[i].y + drawnPoints[i - 1].y) / 2;
        ctx.quadraticCurveTo(drawnPoints[i - 1].x, drawnPoints[i - 1].y, xc, yc);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }
  }, [drawnPoints, strokeColor]);

  // Current demo point
  const currentDemoPoint = guidePoints[Math.min(Math.floor(demoProgress * guidePoints.length), guidePoints.length - 1)];

  const displayChar = 'char' in item ? item.char : item.khmerNumeral;
  const secondaryLabel = 'char' in item 
    ? (language === 'km' ? item.nameKm : item.nameEn)
    : (language === 'km' ? `${item.khmerWord} (${item.khmerPronunciation})` : item.englishWord);

  const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

  return (
    <div className="flex flex-col items-center select-none w-full max-w-md mx-auto">
      {/* Top Header Card */}
      <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-xl border-4 border-amber-200 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={playItemSound}
            className="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 shadow-md flex items-center justify-center text-amber-950 transition transform"
            title="Pronounce letter"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-amber-900 font-['Kantumruy_Pro']">
                {displayChar}
              </span>
              {'series' in item && item.series && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  item.series === 'or' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {item.series === 'or' ? 'ពួក អ (1st Series)' : 'ពួក អ៊ (2nd Series)'}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-slate-500 font-['Fredoka']">
              {secondaryLabel}
            </p>
          </div>
        </div>

        {/* Example Word Badge */}
        {'exampleIcon' in item && (
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
            <span className="text-2xl">{item.exampleIcon}</span>
            <span className="text-xs font-bold text-amber-900 hidden sm:inline">
              {language === 'km' ? item.exampleWordKm : item.exampleWordEn}
            </span>
          </div>
        )}
      </div>

      {/* Main Canvas Container with layered SVG guide & touch canvas */}
      <div className="relative w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden touch-none flex items-center justify-center">
        {/* Faint Outline Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <span className="text-[170px] font-bold text-slate-800 font-['Kantumruy_Pro']">
            {displayChar}
          </span>
        </div>

        {/* SVG Guide Stroke Path */}
        <svg
          viewBox="0 0 300 300"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Guide track (dashed grey road) */}
          <path
            d={item.svgPath}
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="32"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={item.svgPath}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="4"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />

          {/* Guide circles along path */}
          {guidePoints.map((pt, idx) => {
            const isVisited = visitedGuideIndices.has(idx);
            return (
              <g key={idx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isVisited ? 12 : 9}
                  fill={isVisited ? '#10B981' : '#FBBF24'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />
                {idx === 0 && !isVisited && (
                  <text
                    x={pt.x}
                    y={pt.y - 14}
                    textAnchor="middle"
                    fill="#D97706"
                    fontSize="11"
                    fontWeight="800"
                  >
                    START
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML5 Interactive Drawing Canvas */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="absolute inset-0 w-full h-full cursor-crosshair z-10"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />

        {/* Animated Stroke Guide / Star Mascot demo */}
        {isDemonstrating && currentDemoPoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${(currentDemoPoint.x / 300) * 100}%`,
              top: `${(currentDemoPoint.y / 300) * 100}%`,
            }}
          >
            <div className="relative">
              <span className="text-3xl animate-bounce block drop-shadow-md">⭐</span>
              <div className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-ping" />
            </div>
          </div>
        )}

        {/* Floating Sparkles */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute pointer-events-none rounded-full animate-ping z-30"
            style={{
              left: `${(sp.x / 300) * 100}%`,
              top: `${(sp.y / 300) * 100}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              backgroundColor: sp.color,
            }}
          />
        ))}

        {/* Success Overlay with Confetti & Next Button */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <Award className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-emerald-700 font-['Fredoka']">
              {language === 'km' ? 'អស្ចារ្យណាស់កូន!' : 'Spectacular Job!'}
            </h3>
            <p className="text-sm font-bold text-slate-500 mt-1 mb-4">
              {language === 'km' ? 'កូនទទួលបានផ្កាយ ១ និងចេក ១ ផ្លែ!' : 'You earned 1 Star & 1 Banana for Sva-Li!'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                {language === 'km' ? 'គូសឡើងវិញ' : 'Trace Again'}
              </button>
              {onNext && (
                <button
                  onClick={onNext}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg hover:shadow-emerald-300 active:scale-95 transition flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {language === 'km' ? 'បន្តទៅមុខ' : 'Next Letter'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gentle Nudge Alert Banner */}
      {nudgeMessage && !isCompleted && (
        <div className="mt-3 bg-amber-100 border-2 border-amber-300 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold animate-bounce flex items-center gap-2">
          <span>💡</span>
          <span>{nudgeMessage}</span>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="w-full mt-4 flex items-center justify-between bg-white rounded-2xl p-2.5 shadow-md border-2 border-amber-200">
        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setStrokeColor(c);
                soundEffects.playPop();
              }}
              style={{ backgroundColor: c }}
              className={`w-7 h-7 rounded-full transition-transform ${
                strokeColor === c ? 'scale-125 ring-2 ring-slate-400' : 'hover:scale-110'
              }`}
              title="Change crayon color"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerGuideDemonstration}
            className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 transition active:scale-95"
            title="Show guide animation"
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95"
            title="Clear canvas"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
