import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { BILINGUAL_NUMBERS } from '../data/curriculumData';

interface CountingBasketGameProps {
  language: 'km' | 'en';
  onEarnReward: () => void;
}

export const CountingBasketGame: React.FC<CountingBasketGameProps> = ({
  language,
  onEarnReward,
}) => {
  const [targetIndex, setTargetIndex] = useState(0);
  const currentTarget = BILINGUAL_NUMBERS[targetIndex];
  const targetCount = currentTarget.number;

  // Items currently inside basket
  const [basketItems, setBasketItems] = useState<number[]>([]);
  // Available items in the tree/field waiting to be picked
  const [availableItems, setAvailableItems] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [isWon, setIsWon] = useState(false);

  // Reset when target number changes
  useEffect(() => {
    setBasketItems([]);
    setAvailableItems([1, 2, 3, 4, 5, 6]);
    setIsWon(false);
  }, [targetIndex]);

  const countWordsKm = ['', 'មួយ', 'ពីរ', 'បី', 'បួន', 'ប្រាំ'];
  const countWordsEn = ['', 'One', 'Two', 'Three', 'Four', 'Five'];

  // Put item into basket
  const handleAddToBasket = (itemId: number) => {
    if (basketItems.length >= targetCount) return;

    soundEffects.playPop();
    const newBasket = [...basketItems, itemId];
    setBasketItems(newBasket);
    setAvailableItems(availableItems.filter((id) => id !== itemId));

    // Announce current count out loud
    const currentCount = newBasket.length;
    const word = language === 'km' ? countWordsKm[currentCount] : countWordsEn[currentCount];
    soundEffects.speak(word, language);

    // Check if target reached
    if (currentCount === targetCount) {
      setTimeout(() => {
        setIsWon(true);
        soundEffects.playFanfare();
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        onEarnReward();
      }, 500);
    }
  };

  // Remove item from basket
  const handleRemoveFromBasket = (itemId: number) => {
    if (isWon) return;
    soundEffects.playPop();
    setBasketItems(basketItems.filter((id) => id !== itemId));
    setAvailableItems([...availableItems, itemId]);
  };

  const nextNumber = () => {
    setTargetIndex((prev) => (prev + 1) % BILINGUAL_NUMBERS.length);
  };

  const playPronunciation = () => {
    soundEffects.playPop();
    const text = language === 'km' 
      ? `${currentTarget.khmerWord} ${currentTarget.itemLabelKm}`
      : `${currentTarget.englishWord} ${currentTarget.itemLabelEn}`;
    soundEffects.speak(text, language);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto select-none p-3">
      {/* Target Mission Banner */}
      <div className="w-full bg-white/95 rounded-3xl p-4 shadow-xl border-4 border-amber-300 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={playPronunciation}
            className="w-14 h-14 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 shadow-md flex items-center justify-center text-amber-950 transition transform"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-900 font-['Kantumruy_Pro']">
                {language === 'km' ? currentTarget.khmerNumeral : currentTarget.number}
              </span>
              <span className="text-lg font-extrabold text-amber-700 font-['Fredoka']">
                {language === 'km' 
                  ? `${currentTarget.khmerWord} (${currentTarget.khmerPronunciation})`
                  : currentTarget.englishWord}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500">
              {language === 'km' 
                ? `ដាក់ ${currentTarget.itemLabelKm} ចំនួន ${currentTarget.khmerNumeral} ក្នុងកន្ត្រក!` 
                : `Put ${currentTarget.number} ${currentTarget.itemLabelEn} into the basket!`}
            </p>
          </div>
        </div>

        {/* Progress Counter Pill */}
        <div className="flex flex-col items-end">
          <div className="bg-amber-100 border-2 border-amber-300 px-3 py-1 rounded-2xl flex items-center gap-1.5 font-black text-amber-900 text-lg">
            <span>{basketItems.length}</span>
            <span className="text-slate-400">/</span>
            <span>{targetCount}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 mt-0.5">
            {language === 'km' ? 'ចំនួនសរុប' : 'Target Count'}
          </span>
        </div>
      </div>

      {/* Orchard / Play Area */}
      <div className="w-full bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 rounded-3xl p-5 shadow-2xl border-4 border-emerald-300 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Floating clouds decorative */}
        <div className="absolute top-2 left-4 text-3xl opacity-60">☁️</div>
        <div className="absolute top-6 right-6 text-2xl opacity-60">☁️</div>

        {/* Upper Zone: Available clickable items bouncing */}
        <div>
          <div className="text-center mb-2">
            <span className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-extrabold text-slate-700 shadow-sm">
              {language === 'km' ? '👇 ចុចលើរូបដើម្បីប្រមូលដាក់កន្ត្រក' : '👇 Tap objects to collect into the basket!'}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 py-2 min-h-[90px]">
            {availableItems.map((id) => (
              <button
                key={id}
                onClick={() => handleAddToBasket(id)}
                className="w-16 h-16 bg-white/90 hover:bg-white rounded-2xl shadow-lg border-2 border-emerald-200 flex items-center justify-center text-4xl hover:scale-110 active:scale-90 transition transform animate-bounce"
                style={{ animationDuration: `${1.2 + (id % 3) * 0.4}s` }}
                title={`Add ${currentTarget.itemLabelEn}`}
              >
                {currentTarget.itemIcon}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Zone: Authentic Woven Basket */}
        <div className="relative flex flex-col items-center mt-4">
          {/* Basket Container */}
          <div className="w-64 sm:w-72 h-36 bg-amber-800 rounded-b-[60px] rounded-t-2xl shadow-2xl border-4 border-amber-900 relative flex items-center justify-center p-3 overflow-hidden">
            {/* Basket weave pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FDE68A_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="absolute top-0 left-0 right-0 h-4 bg-amber-950/40 rounded-t-xl" />

            {/* Collected items inside basket */}
            <div className="flex flex-wrap items-center justify-center gap-2 z-10">
              {basketItems.map((id) => (
                <button
                  key={id}
                  onClick={() => handleRemoveFromBasket(id)}
                  className="w-12 h-12 bg-amber-200/90 rounded-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition shadow transform"
                  title="Tap to remove"
                >
                  {currentTarget.itemIcon}
                </button>
              ))}

              {basketItems.length === 0 && (
                <span className="text-amber-200/80 text-xs font-extrabold italic">
                  {language === 'km' ? 'កន្ត្រកនៅទទេ...' : 'Basket is empty...'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Win Modal Celebration */}
        {isWon && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-3 shadow-inner">
              <Award className="w-12 h-12 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <h3 className="text-2xl font-black text-amber-900 font-['Fredoka']">
              {language === 'km' 
                ? `កូនរាប់បាន ${currentTarget.khmerWord} ត្រឹមត្រូវ!` 
                : `Awesome! You counted ${currentTarget.englishWord}!`}
            </h3>
            <p className="text-sm font-bold text-slate-500 mt-1 mb-4">
              {language === 'km' 
                ? 'កូនទទួលបានចេក ១ ផ្លែសម្រាប់ស្វាលី!' 
                : 'You earned 1 Banana to feed Sva-Li the monkey!'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setBasketItems([]);
                  setAvailableItems([1, 2, 3, 4, 5, 6]);
                  setIsWon(false);
                }}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 active:scale-95 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                {language === 'km' ? 'រាប់ឡើងវិញ' : 'Count Again'}
              </button>
              <button
                onClick={nextNumber}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-lg hover:shadow-amber-300 active:scale-95 transition flex items-center gap-2"
              >
                <span>{language === 'km' ? 'លេខបន្ទាប់' : 'Next Number'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Number Select Row */}
      <div className="w-full mt-3 flex items-center justify-center gap-2">
        {BILINGUAL_NUMBERS.map((num, idx) => (
          <button
            key={num.number}
            onClick={() => setTargetIndex(idx)}
            className={`w-11 h-11 rounded-2xl font-black text-lg transition-all ${
              targetIndex === idx
                ? 'bg-amber-500 text-white scale-110 shadow-lg ring-4 ring-amber-200'
                : 'bg-white text-slate-700 hover:bg-amber-50 border-2 border-amber-200'
            }`}
          >
            {language === 'km' ? num.khmerNumeral : num.number}
          </button>
        ))}
      </div>
    </div>
  );
};
