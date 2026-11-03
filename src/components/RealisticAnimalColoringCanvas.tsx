import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, RefreshCw, Award, CheckCircle2, Wand2, Info } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { RealisticAnimalTemplate, BrushTexture } from '../types/curriculum';
import { REALISTIC_ANIMALS } from '../data/realisticAnimalsData';

interface RealisticAnimalColoringCanvasProps {
  language: 'km' | 'en';
  onCompleteAnimal: (animalId: string) => void;
}

export const RealisticAnimalColoringCanvas: React.FC<RealisticAnimalColoringCanvasProps> = ({
  language,
  onCompleteAnimal,
}) => {
  const [selectedAnimalIndex, setSelectedAnimalIndex] = useState(0);
  const animal = REALISTIC_ANIMALS[selectedAnimalIndex];

  // Map of region id -> active color
  const [regionColors, setRegionColors] = useState<Record<string, string>>({});
  // Selected brush color
  const [selectedBrushColor, setSelectedBrushColor] = useState<string>('#64748B');
  // Selected brush texture
  const [activeTexture, setActiveTexture] = useState<BrushTexture>('solid');
  // Last painted region name for bilingual voice feedback
  const [lastPaintedRegion, setLastPaintedRegion] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize/reset colors when animal changes
  useEffect(() => {
    const initial: Record<string, string> = {};
    animal.regions.forEach((r) => {
      initial[r.id] = r.defaultColor;
    });
    setRegionColors(initial);
    setSelectedBrushColor(animal.regions[0]?.realisticColor || '#64748B');
    setIsCompleted(false);
    setLastPaintedRegion(null);
  }, [selectedAnimalIndex]);

  // Handle painting a specific segmented region
  const handlePaintRegion = (regionId: string) => {
    const region = animal.regions.find((r) => r.id === regionId);
    if (!region) return;

    soundEffects.playPop();

    // Trigger realistic animal sound when painting the animal!
    soundEffects.playAnimalSound(animal.soundType);

    // Update color
    setRegionColors((prev) => {
      const next = { ...prev, [regionId]: selectedBrushColor };

      // Check if all non-default painted
      const allPainted = animal.regions.every((r) => next[r.id] !== r.defaultColor);
      if (allPainted && !isCompleted) {
        setTimeout(() => {
          setIsCompleted(true);
          soundEffects.playFanfare();
          soundEffects.playAnimalSound(animal.soundType);
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
          });
          onCompleteAnimal(animal.id);
        }, 400);
      }
      return next;
    });

    const regionName = language === 'km' ? region.nameKm : region.nameEn;
    setLastPaintedRegion(regionName);

    // Speak region feedback in bilingual audio
    const feedbackText = language === 'km'
      ? `ផាត់ ${region.nameKm} នៃ ${animal.nameKm}!`
      : `Painted ${region.nameEn} of the ${animal.nameEn}!`;
    soundEffects.speak(feedbackText, language);
  };

  // Auto-paint realistically helper for younger toddlers
  const handleAutoPaintRealistic = () => {
    soundEffects.playFanfare();
    soundEffects.playAnimalSound(animal.soundType);

    const realisticMap: Record<string, string> = {};
    animal.regions.forEach((r) => {
      realisticMap[r.id] = r.realisticColor;
    });
    setRegionColors(realisticMap);
    setIsCompleted(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onCompleteAnimal(animal.id);
  };

  const resetCanvas = () => {
    soundEffects.playPop();
    const initial: Record<string, string> = {};
    animal.regions.forEach((r) => {
      initial[r.id] = r.defaultColor;
    });
    setRegionColors(initial);
    setIsCompleted(false);
    setLastPaintedRegion(null);
  };

  const playAnimalVocal = () => {
    soundEffects.playAnimalSound(animal.soundType);
    const text = language === 'km' 
      ? `${animal.nameKm} រស់នៅ ${animal.habitatKm}។ ${animal.funFactKm}` 
      : `${animal.nameEn}. Lives in ${animal.habitatEn}. ${animal.funFactEn}`;
    soundEffects.speak(text, language);
  };

  // Color palette options
  const palette = [
    { label: 'Leather Grey', color: '#64748B' },
    { label: 'Dark Slate', color: '#334155' },
    { label: 'Tiger Orange', color: '#F97316' },
    { label: 'Deep Amber', color: '#D97706' },
    { label: 'Peacock Emerald', color: '#059669' },
    { label: 'Sapphire Blue', color: '#2563EB' },
    { label: 'Sky Dolphin', color: '#0284C7' },
    { label: 'Hare Warm Brown', color: '#B45309' },
    { label: 'Ivory White', color: '#FFFBEB' },
    { label: 'Velvet Pink', color: '#F472B6' },
    { label: 'Nature Green', color: '#10B981' },
    { label: 'Midnight Black', color: '#0F172A' },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none">
      {/* Animal Header Card */}
      <div className="w-full bg-white/95 rounded-3xl p-4 shadow-xl border-4 border-emerald-300 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={playAnimalVocal}
            className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white shadow-md flex items-center justify-center transition transform"
            title="Hear realistic animal sound & fact"
          >
            <Volume2 className="w-8 h-8 animate-pulse" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-950 font-['Kantumruy_Pro']">
                {language === 'km' ? animal.nameKm : animal.nameEn}
              </span>
              <span className="text-xl">{animal.icon}</span>
            </div>
            <p className="text-xs font-bold text-slate-500 italic">
              {animal.scientificName} • {language === 'km' ? animal.habitatKm : animal.habitatEn}
            </p>
          </div>
        </div>

        {/* Realistic Auto-Fill Magic Wand */}
        <button
          onClick={handleAutoPaintRealistic}
          className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-black flex items-center gap-1.5 active:scale-95 transition shadow-xs"
          title="See realistic colors"
        >
          <Wand2 className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">{language === 'km' ? 'ពណ៌ពិត' : 'Real Color'}</span>
        </button>
      </div>

      {/* Animal Selector Carousel */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-2 px-1">
        {REALISTIC_ANIMALS.map((a, idx) => {
          const isSelected = idx === selectedAnimalIndex;
          return (
            <button
              key={a.id}
              onClick={() => {
                setSelectedAnimalIndex(idx);
                soundEffects.playPop();
                soundEffects.playAnimalSound(a.soundType);
              }}
              className={`px-3 py-2 rounded-2xl flex items-center gap-2 font-black text-xs shrink-0 transition transform active:scale-95 ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-lg scale-105 ring-4 ring-emerald-200'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border-2 border-emerald-200'
              }`}
            >
              <span className="text-lg">{a.icon}</span>
              <span>{language === 'km' ? a.nameKm : a.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive High-Contrast Vector Coloring Canvas */}
      <div className="relative w-[330px] h-[310px] sm:w-[380px] sm:h-[320px] bg-gradient-to-b from-sky-50 via-white to-amber-50/50 rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden flex items-center justify-center p-2">
        {/* SVG Realistic Animal Canvas */}
        <svg
          viewBox={animal.viewBox}
          className="w-full h-full filter drop-shadow-md cursor-pointer"
        >
          {/* Defs for textures (Fur, Leather, Iridescent Feathers, Sparkles) */}
          <defs>
            {/* Fur texture pattern */}
            <pattern id="fur-pattern" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 0,2 Q 4,4 8,2 M 0,6 Q 4,8 8,6" stroke="#000000" strokeWidth="0.8" opacity="0.15" fill="none" />
            </pattern>
            {/* Leather texture pattern */}
            <pattern id="leather-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="#000000" opacity="0.12" />
              <circle cx="9" cy="9" r="1.5" fill="#000000" opacity="0.12" />
            </pattern>
            {/* Feather iridescent gradient */}
            <linearGradient id="peacock-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Render segmented animal body parts */}
          {animal.regions.map((region) => {
            const fillColor = regionColors[region.id] || region.defaultColor;
            return (
              <g
                key={region.id}
                onClick={() => handlePaintRegion(region.id)}
                className="group cursor-pointer"
              >
                {/* Base segment fill (keeps paint perfectly inside lines) */}
                <path
                  d={region.svgPath}
                  fill={activeTexture === 'rainbow' ? 'url(#peacock-shimmer)' : fillColor}
                  stroke="#1E293B"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-colors duration-300 hover:brightness-110 active:scale-[0.99] origin-center"
                />

                {/* Texture overlay if applicable */}
                {region.textureEffect === 'fur' && (
                  <path
                    d={region.svgPath}
                    fill="url(#fur-pattern)"
                    stroke="none"
                    className="pointer-events-none"
                  />
                )}
                {region.textureEffect === 'leather' && (
                  <path
                    d={region.svgPath}
                    fill="url(#leather-pattern)"
                    stroke="none"
                    className="pointer-events-none"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Instruction Banner */}
        <div className="absolute top-2 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-emerald-200 text-[11px] font-black text-slate-700 shadow-sm flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {language === 'km'
              ? 'ចុចលើផ្នែកសត្វដើម្បីផាត់ពណ៌ និងស្តាប់សំឡេងពិត!'
              : 'Tap any body part to paint & hear realistic sound!'}
          </span>
        </div>

        {/* Reset / Clear Button */}
        <button
          onClick={resetCanvas}
          className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-xl shadow-md border border-slate-200 text-slate-700 active:scale-95 transition"
          title="Reset animal coloring"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Success celebratory modal */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-inner">
              <Award className="w-12 h-12 text-emerald-600 animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-emerald-800 font-['Fredoka']">
              {language === 'km' ? 'ផាត់ពណ៌បានស្រស់ស្អាតណាស់!' : 'Masterpiece Completed!'}
            </h3>
            <p className="text-xs font-bold text-slate-600 mt-1 mb-4">
              {language === 'km' ? animal.funFactKm : animal.funFactEn}
            </p>
            <div className="flex gap-2">
              <button
                onClick={resetCanvas}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs"
              >
                {language === 'km' ? 'ផាត់ឡើងវិញ' : 'Paint Again'}
              </button>
              <button
                onClick={() => {
                  setSelectedAnimalIndex((prev) => (prev + 1) % REALISTIC_ANIMALS.length);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs shadow-md"
              >
                {language === 'km' ? 'សត្វបន្ទាប់' : 'Next Real Animal'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Textured Color Brushes Toolbar */}
      <div className="w-full mt-3 bg-white/95 rounded-2xl p-3 shadow-md border-2 border-emerald-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-800">
            {language === 'km' ? 'ជក់ពណ៌និងសាច់រោម (Textured Brushes)' : 'Natural Texture & Color Palette'}
          </span>
          {lastPaintedRegion && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {language === 'km' ? 'ទើបតែផាត់៖ ' : 'Painted: '}
              {lastPaintedRegion}
            </span>
          )}
        </div>

        {/* Brush Texture Mode Selector */}
        <div className="flex gap-1.5 mb-2.5 overflow-x-auto pb-1">
          {[
            { id: 'solid', labelKm: 'ពណ៌ធម្មតា', labelEn: 'Solid Tone' },
            { id: 'fur', labelKm: 'សាច់រោម (Fur)', labelEn: 'Animal Fur' },
            { id: 'leather', labelKm: 'ស្បែកក្រាស់ (Leather)', labelEn: 'Leathery Skin' },
            { id: 'feathers', labelKm: 'ផ្លែរោមបក្សី', labelEn: 'Feather Plumage' },
            { id: 'rainbow', labelKm: 'ឥន្ទធនូភ្លឺ', labelEn: 'Rainbow Shimmer' },
          ].map((tex) => (
            <button
              key={tex.id}
              onClick={() => {
                setActiveTexture(tex.id as BrushTexture);
                soundEffects.playPop();
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold whitespace-nowrap transition ${
                activeTexture === tex.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              {language === 'km' ? tex.labelKm : tex.labelEn}
            </button>
          ))}
        </div>

        {/* Palette Color Circles */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {palette.map((item) => (
            <button
              key={item.color}
              onClick={() => {
                setSelectedBrushColor(item.color);
                soundEffects.playPop();
              }}
              style={{ backgroundColor: item.color }}
              className={`w-7 h-7 rounded-full shrink-0 transition-transform ${
                selectedBrushColor === item.color
                  ? 'scale-125 ring-3 ring-emerald-500 shadow-md'
                  : 'hover:scale-110 border border-slate-300'
              }`}
              title={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
