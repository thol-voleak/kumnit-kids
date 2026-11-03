import React, { useState, useEffect } from 'react';
import { Heart, Volume2, Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';

interface MascotCompanionProps {
  language: 'km' | 'en';
  bananas: number;
  happiness: number; // 0 to 100
  onFeedBanana: () => void;
  activeContextHint?: string;
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({
  language,
  bananas,
  happiness,
  onFeedBanana,
  activeContextHint,
}) => {
  const [expression, setExpression] = useState<'idle' | 'happy' | 'eating' | 'cheering'>('idle');
  const [speechBubble, setSpeechBubble] = useState<string>('');

  useEffect(() => {
    if (activeContextHint) {
      setSpeechBubble(activeContextHint);
    } else {
      setSpeechBubble(
        language === 'km'
          ? 'ជំរាបសួរកូន! ខ្ញុំឈ្មោះស្វាលី! តោះរៀនជាមួយគ្នា!'
          : "Hi friend! I'm Sva-Li! Let's learn and play together!"
      );
    }
  }, [language, activeContextHint]);

  // Periodic cute blinking & idle animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (expression === 'idle') {
        setExpression('happy');
        setTimeout(() => setExpression('idle'), 1200);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [expression]);

  const handleFeed = () => {
    if (bananas <= 0) {
      soundEffects.playEncouragingNudge();
      setSpeechBubble(
        language === 'km'
          ? 'គូសអក្សរ ឬរាប់លេខដើម្បីទទួលបានចេកបន្ថែមណា!'
          : 'Trace letters or count objects to earn more yummy bananas!'
      );
      return;
    }

    soundEffects.playMunch();
    setExpression('eating');
    onFeedBanana();

    setSpeechBubble(
      language === 'km'
        ? 'ឆ្ងាញ់ណាស់! អរគុណកូនពូកែ! ❤️'
        : 'Yum yum! So sweet! Thank you superstar! ❤️'
    );

    setTimeout(() => {
      setExpression('cheering');
      soundEffects.playFanfare();
      setTimeout(() => setExpression('idle'), 2000);
    }, 900);
  };

  const handleTapMascot = () => {
    soundEffects.playPop();
    setExpression('cheering');
    soundEffects.speak(speechBubble, language);
    setTimeout(() => setExpression('idle'), 1500);
  };

  return (
    <div className="w-full bg-amber-100/90 rounded-3xl p-3 border-3 border-amber-300 shadow-md flex items-center justify-between gap-3 select-none">
      {/* Mascot Avatar and Speech Bubble */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleTapMascot}
          className="relative group focus:outline-none transition-transform active:scale-95"
          title="Tap Sva-Li"
        >
          {/* Sva-Li Character Box */}
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-2xl flex items-center justify-center text-4xl shadow-md border-2 border-amber-300 relative overflow-hidden">
            {expression === 'idle' && <span className="animate-pulse">🐒</span>}
            {expression === 'happy' && <span className="scale-110 transition">🐵</span>}
            {expression === 'eating' && <span className="animate-bounce">🍌🐵</span>}
            {expression === 'cheering' && <span className="scale-125 transition">🎉🐒</span>}

            {/* Little Cambodian scarf (Krama) indicator */}
            <div className="absolute bottom-0 inset-x-0 h-2 bg-red-500/80 [background-image:linear-gradient(45deg,#fff_25%,transparent_25%),linear-gradient(-45deg,#fff_25%,transparent_25%)] [background-size:6px_6px]" />
          </div>

          {/* Floating Heart if well-fed */}
          {happiness >= 80 && (
            <div className="absolute -top-1 -right-1 text-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-ping" />
            </div>
          )}
        </button>

        {/* Speech Bubble */}
        <div className="relative bg-white rounded-2xl px-3 py-1.5 shadow-sm border border-amber-200 max-w-[170px] sm:max-w-xs">
          <div className="absolute left-[-6px] top-4 w-2.5 h-2.5 bg-white border-l border-b border-amber-200 transform rotate-45" />
          <p className="text-[11px] font-bold text-amber-950 leading-tight">
            {speechBubble}
          </p>
        </div>
      </div>

      {/* Feed Banana Action Button & Happiness Meter */}
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={handleFeed}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-black text-xs shadow-md transition transform active:scale-90 ${
            bananas > 0
              ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 hover:shadow-amber-300 animate-pulse'
              : 'bg-slate-200 text-slate-500 cursor-not-allowed'
          }`}
          title="Feed Sva-Li"
        >
          <span className="text-base">🍌</span>
          <span>{bananas}</span>
          <span className="hidden sm:inline font-bold text-[10px]">
            {language === 'km' ? 'បញ្ចុក' : 'Feed'}
          </span>
        </button>

        {/* Happiness Meter */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-extrabold text-amber-800">
            {language === 'km' ? 'ក្តីសុខ' : 'Mood'}
          </span>
          <div className="w-16 h-2 bg-amber-200 rounded-full overflow-hidden border border-amber-300">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-500"
              style={{ width: `${happiness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
