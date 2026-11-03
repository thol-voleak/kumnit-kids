import React, { useState } from 'react';
import { Palette, Trash2, Sparkles, Download, RotateCcw } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { StickerItem } from '../types/curriculum';

interface PlacedSticker {
  uid: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

interface StickerBoardProps {
  language: 'km' | 'en';
  unlockedStickers: StickerItem[];
}

export const StickerBoard: React.FC<StickerBoardProps> = ({
  language,
  unlockedStickers,
}) => {
  const [backgroundScene, setBackgroundScene] = useState<'angkor' | 'jungle' | 'sky'>('angkor');
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([
    { uid: 'init-1', emoji: '🐒', x: 120, y: 160, size: 56, rotation: 0 },
    { uid: 'init-2', emoji: '🍌', x: 210, y: 170, size: 40, rotation: 15 },
    { uid: 'init-3', emoji: '⭐', x: 60, y: 50, size: 36, rotation: -10 },
  ]);
  const [selectedStickerUid, setSelectedStickerUid] = useState<string | null>(null);

  // Background scene styles
  const sceneThemes = {
    angkor: {
      labelKm: 'ប្រាសាទអង្គរវត្ត',
      labelEn: 'Angkor Temple Sunrise',
      bgClass: 'bg-gradient-to-b from-amber-200 via-rose-200 to-amber-100',
      landmark: '🏛️',
    },
    jungle: {
      labelKm: 'ព្រៃត្រូពិចកម្ពុជា',
      labelEn: 'Cambodian Rainforest',
      bgClass: 'bg-gradient-to-b from-emerald-200 via-teal-100 to-emerald-300',
      landmark: '🌴',
    },
    sky: {
      labelKm: 'មេឃឥន្ទធនូ',
      labelEn: 'Rainbow Cloud Sky',
      bgClass: 'bg-gradient-to-b from-sky-200 via-indigo-100 to-pink-100',
      landmark: '🌈',
    },
  };

  const handleAddSticker = (sticker: StickerItem) => {
    if (!sticker.unlocked) {
      soundEffects.playEncouragingNudge();
      return;
    }

    soundEffects.playPop();
    const newPlaced: PlacedSticker = {
      uid: `stk-${Date.now()}-${Math.random()}`,
      emoji: sticker.emoji,
      x: 100 + (Math.random() * 80 - 40),
      y: 120 + (Math.random() * 80 - 40),
      size: 52,
      rotation: Math.floor(Math.random() * 30 - 15),
    };
    setPlacedStickers((prev) => [...prev, newPlaced]);
    setSelectedStickerUid(newPlaced.uid);
  };

  const handleDragSticker = (uid: string, dx: number, dy: number) => {
    setPlacedStickers((prev) =>
      prev.map((s) => (s.uid === uid ? { ...s, x: Math.max(20, Math.min(260, s.x + dx)), y: Math.max(20, Math.min(260, s.y + dy)) } : s))
    );
  };

  const clearBoard = () => {
    soundEffects.playPop();
    setPlacedStickers([]);
  };

  return (
    <div className="w-full max-w-md mx-auto select-none flex flex-col items-center">
      {/* Scene Selector */}
      <div className="w-full flex items-center justify-between bg-white rounded-2xl p-2 mb-3 shadow-md border-2 border-amber-200">
        <span className="text-xs font-black text-amber-900 ml-2">
          {language === 'km' ? 'ទេសភាព៖' : 'Background:'}
        </span>
        <div className="flex gap-1.5">
          {(['angkor', 'jungle', 'sky'] as const).map((sc) => (
            <button
              key={sc}
              onClick={() => {
                setBackgroundScene(sc);
                soundEffects.playPop();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition flex items-center gap-1 ${
                backgroundScene === sc
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-amber-50 text-slate-700 hover:bg-amber-100'
              }`}
            >
              <span>{sceneThemes[sc].landmark}</span>
              <span className="hidden sm:inline">
                {language === 'km' ? sceneThemes[sc].labelKm : sceneThemes[sc].labelEn}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div
        className={`relative w-[320px] h-[320px] sm:w-[350px] sm:h-[350px] rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden ${sceneThemes[backgroundScene].bgClass}`}
        onClick={() => setSelectedStickerUid(null)}
      >
        {/* Background decorative elements */}
        {backgroundScene === 'angkor' && (
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between pointer-events-none opacity-40">
            <span className="text-7xl">🏛️</span>
            <span className="text-5xl">🌴</span>
            <span className="text-6xl">🪷</span>
          </div>
        )}
        {backgroundScene === 'jungle' && (
          <div className="absolute bottom-2 left-4 right-4 flex items-end justify-between pointer-events-none opacity-40">
            <span className="text-6xl">🌴</span>
            <span className="text-7xl">🌿</span>
            <span className="text-6xl">🌳</span>
          </div>
        )}
        {backgroundScene === 'sky' && (
          <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-40">
            <div className="flex justify-between">
              <span className="text-4xl">☁️</span>
              <span className="text-5xl">☀️</span>
            </div>
            <div className="text-center">
              <span className="text-7xl">🌈</span>
            </div>
          </div>
        )}

        {/* Placed Stickers */}
        {placedStickers.map((stk) => {
          const isSelected = selectedStickerUid === stk.uid;
          return (
            <div
              key={stk.uid}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStickerUid(stk.uid);
                soundEffects.playPop();
              }}
              style={{
                left: `${stk.x}px`,
                top: `${stk.y}px`,
                transform: `rotate(${stk.rotation}deg)`,
                fontSize: `${stk.size}px`,
              }}
              className={`absolute cursor-move select-none transition-transform hover:scale-110 active:scale-95 ${
                isSelected ? 'ring-2 ring-amber-500 rounded-2xl bg-white/30 backdrop-blur-xs p-1' : ''
              }`}
            >
              {stk.emoji}
            </div>
          );
        })}

        {/* Canvas Toolbar overlay (Clear & Count) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            onClick={clearBoard}
            className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-md transition active:scale-95"
            title="Clear scene"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Helper instruction */}
        {placedStickers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 pointer-events-none">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <p className="text-xs font-bold mt-2">
              {language === 'km' ? 'ចុចលើស្ទីគ័រខាងក្រោមដើម្បីតុបតែង!' : 'Tap stickers below to decorate your scene!'}
            </p>
          </div>
        )}
      </div>

      {/* Unlocked Sticker Tray */}
      <div className="w-full mt-3 bg-white/95 rounded-2xl p-3 shadow-md border-2 border-amber-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-700">
            {language === 'km' ? '🎨 កាតាឡុកស្ទីគ័រដែលបានបើកសោ' : '🎨 Your Unlocked Stickers'}
          </span>
          <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {unlockedStickers.filter((s) => s.unlocked).length} / {unlockedStickers.length}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {unlockedStickers.map((sticker) => (
            <button
              key={sticker.id}
              onClick={() => handleAddSticker(sticker)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-2xl shrink-0 transition relative ${
                sticker.unlocked
                  ? 'bg-amber-50 hover:bg-amber-100 hover:scale-105 active:scale-95 border-2 border-amber-200 shadow-sm'
                  : 'bg-slate-100 opacity-50 cursor-not-allowed border-2 border-slate-200'
              }`}
              title={sticker.unlocked ? sticker.nameEn : 'Locked - complete lessons to unlock!'}
            >
              <span>{sticker.emoji}</span>
              {!sticker.unlocked && (
                <span className="absolute inset-0 flex items-center justify-center bg-slate-900/30 rounded-2xl text-xs">
                  🔒
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
