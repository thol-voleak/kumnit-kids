import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Code2,
  Smartphone,
  Star,
  Award,
  Volume2,
  VolumeX,
  Languages,
  PenTool,
  Apple,
  Mic,
  Heart,
  Palette,
  BrainCircuit,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { soundEffects } from './utils/audioSynth';
import {
  KHMER_CONSONANTS,
  ENGLISH_LETTERS,
  BILINGUAL_NUMBERS,
  INITIAL_STICKERS,
} from './data/curriculumData';
import { LetterItem, NumberItem, StickerItem } from './types/curriculum';
import { TracingCanvas } from './components/TracingCanvas';
import { RealisticAnimalColoringCanvas } from './components/RealisticAnimalColoringCanvas';
import { CountingBasketGame } from './components/CountingBasketGame';
import { AiPronunciationCoach } from './components/AiPronunciationCoach';
import { ParentVoiceRecorder } from './components/ParentVoiceRecorder';
import { StickerBoard } from './components/StickerBoard';
import { MascotCompanion } from './components/MascotCompanion';
import { AdaptiveReviewDashboard } from './components/AdaptiveReviewDashboard';
import { PrdViewer } from './components/PrdViewer';
import { FlutterArchitectureViewer } from './components/FlutterArchitectureViewer';
import { AndroidInstallModal } from './components/AndroidInstallModal';

export default function App() {
  // Global App Language (Khmer vs English)
  const [language, setLanguage] = useState<'km' | 'en'>('km');

  // Top navigation view mode
  const [viewMode, setViewMode] = useState<'app_prototype' | 'prd' | 'flutter_code'>('app_prototype');

  // Android Install Modal State
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Active module in the Kids App Prototype
  const [activeModule, setActiveModule] = useState<'tracing' | 'animal_coloring' | 'counting' | 'voice_coach' | 'parent_voice' | 'sticker_board' | 'adaptive_review'>('animal_coloring');

  // Curriculum category filter in tracing module
  const [curriculumTab, setCurriculumTab] = useState<'km_letters' | 'en_letters' | 'numbers'>('km_letters');

  // Currently selected item for tracing
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Rewards & Gamification state
  const [stars, setStars] = useState(12);
  const [bananas, setBananas] = useState(4);
  const [mascotHappiness, setMascotHappiness] = useState(85);
  const [unlockedStickers, setUnlockedStickers] = useState<StickerItem[]>(INITIAL_STICKERS);

  // Sound enabled
  const [soundMuted, setSoundMuted] = useState(false);

  // Get current curriculum item list based on tab
  const getCurrentItemList = (): (LetterItem | NumberItem)[] => {
    if (curriculumTab === 'km_letters') return KHMER_CONSONANTS;
    if (curriculumTab === 'en_letters') return ENGLISH_LETTERS;
    return BILINGUAL_NUMBERS;
  };

  const currentItems = getCurrentItemList();
  const currentItem = currentItems[selectedItemIndex] || currentItems[0];

  // Callback when child successfully completes a trace
  const handleTraceCompleted = (id: string) => {
    setStars((prev) => prev + 1);
    setBananas((prev) => prev + 1);
    setMascotHappiness((prev) => Math.min(100, prev + 10));

    // Unlock next sticker if locked
    setUnlockedStickers((prev) => {
      const firstLockedIdx = prev.findIndex((s) => !s.unlocked);
      if (firstLockedIdx !== -1) {
        const next = [...prev];
        next[firstLockedIdx] = { ...next[firstLockedIdx], unlocked: true };
        return next;
      }
      return prev;
    });
  };

  // Next letter handler
  const handleNextItem = () => {
    soundEffects.playPop();
    setSelectedItemIndex((prev) => (prev + 1) % currentItems.length);
  };

  // Feed banana to Sva-Li
  const handleFeedBanana = () => {
    if (bananas > 0) {
      setBananas((prev) => prev - 1);
      setMascotHappiness((prev) => Math.min(100, prev + 20));
    }
  };

  // Handle selecting an item from the Adaptive Dashboard
  const handleSelectReviewItem = (itemId: string) => {
    const kmIdx = KHMER_CONSONANTS.findIndex((c) => c.id === itemId);
    if (kmIdx !== -1) {
      setCurriculumTab('km_letters');
      setSelectedItemIndex(kmIdx);
      setActiveModule('tracing');
      return;
    }
    const enIdx = ENGLISH_LETTERS.findIndex((c) => c.id === itemId);
    if (enIdx !== -1) {
      setCurriculumTab('en_letters');
      setSelectedItemIndex(enIdx);
      setActiveModule('tracing');
      return;
    }
    const numIdx = BILINGUAL_NUMBERS.findIndex((n) => `num-${n.number}` === itemId);
    if (numIdx !== -1) {
      setCurriculumTab('numbers');
      setSelectedItemIndex(numIdx);
      setActiveModule('tracing');
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100/60 via-orange-50 to-amber-100/40 text-slate-800 flex flex-col font-['Nunito',sans-serif]">
      {/* Top Universal App Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-amber-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-amber-300">
              🐒
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-amber-950 text-base sm:text-lg tracking-tight font-['Fredoka']">
                  Kumnit Kids
                </span>
                <span className="text-xs font-bold text-amber-600 font-['Kantumruy_Pro']">
                  គំនិតកុមារ
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                Bilingual Early Learning Studio
              </span>
            </div>
          </div>

          {/* Primary View Switcher: Interactive App vs PRD vs Flutter Code */}
          <div className="flex items-center bg-amber-100/80 p-1 rounded-2xl border border-amber-200">
            <button
              onClick={() => {
                setViewMode('app_prototype');
                soundEffects.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'app_prototype'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Play App Prototype</span>
              <span className="sm:hidden">App</span>
            </button>

            <button
              onClick={() => {
                setViewMode('prd');
                soundEffects.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'prd'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Product PRD</span>
              <span className="sm:hidden">PRD</span>
            </button>

            <button
              onClick={() => {
                setViewMode('flutter_code');
                soundEffects.playPop();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === 'flutter_code'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-200/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Flutter Code</span>
              <span className="sm:hidden">Flutter</span>
            </button>
          </div>

          {/* Language Switcher & Install on Android Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsInstallModalOpen(true);
                soundEffects.playPop();
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 active:scale-95 transition shadow-md"
              title="Install on Android phone"
            >
              <span>🤖</span>
              <span className="hidden sm:inline">{language === 'km' ? 'ដំឡើងលើ Android (APK)' : 'Install on Android (APK)'}</span>
              <span className="sm:hidden">Install</span>
            </button>

            <button
              onClick={() => {
                const nextLang = language === 'km' ? 'en' : 'km';
                setLanguage(nextLang);
                soundEffects.playPop();
                soundEffects.speak(nextLang === 'km' ? 'ភាសាខ្មែរ' : 'English', nextLang);
              }}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 rounded-xl border-2 border-amber-300 font-extrabold text-xs text-amber-900 flex items-center gap-1.5 active:scale-95 transition shadow-xs"
              title="Switch language"
            >
              <Languages className="w-4 h-4 text-amber-600" />
              <span>{language === 'km' ? '🇰🇭 ភាសាខ្មែរ' : '🇺🇸 English'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 flex flex-col items-center">
        {/* VIEW 1: Interactive Kids Mobile App Prototype */}
        {viewMode === 'app_prototype' && (
          <div className="w-full max-w-lg flex flex-col items-center space-y-4">
            {/* Child Gamification Status Bar (Zero reading required for toddler) */}
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-3 shadow-lg border-2 border-amber-200 flex items-center justify-between">
              {/* Stars & Bananas */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-2xl border border-amber-200">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="font-black text-amber-950 text-sm">{stars}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-2xl border border-yellow-200">
                  <span className="text-lg">🍌</span>
                  <span className="font-black text-yellow-950 text-sm">{bananas}</span>
                </div>
              </div>

              {/* Module Header Title */}
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {activeModule === 'animal_coloring' && (language === 'km' ? '🐘 ផាត់ពណ៌សត្វពិតៗ' : '🐘 Real Animal Painting')}
                {activeModule === 'tracing' && (language === 'km' ? '✍️ គូសតាមបន្ទាត់' : '✍️ Stroke Tracing')}
                {activeModule === 'counting' && (language === 'km' ? '🍎 រាប់ចំនួនផ្លែឈើ' : '🍎 Counting Basket')}
                {activeModule === 'voice_coach' && (language === 'km' ? '🎙️ AI បញ្ចេញសំឡេង' : '🎙️ AI Voice Coach')}
                {activeModule === 'parent_voice' && (language === 'km' ? '❤️ សំឡេងឪពុកម្តាយ' : '❤️ Family Voices')}
                {activeModule === 'sticker_board' && (language === 'km' ? '🎨 ក្ដារស្ទីគ័រ' : '🎨 Sticker Board')}
                {activeModule === 'adaptive_review' && (language === 'km' ? '🧠 តាមដានការរៀន' : '🧠 Smart Review')}
              </span>

              {/* Mute toggle */}
              <button
                onClick={() => {
                  setSoundMuted(!soundMuted);
                  soundEffects.playPop();
                }}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                title={soundMuted ? 'Unmute' : 'Mute'}
              >
                {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Mascot Companion "Sva-Li" Widget */}
            <MascotCompanion
              language={language}
              bananas={bananas}
              happiness={mascotHappiness}
              onFeedBanana={handleFeedBanana}
              activeContextHint={
                activeModule === 'animal_coloring'
                  ? (language === 'km' ? 'ចុចលើផ្នែកសត្វដើម្បីផាត់ពណ៌ និងស្តាប់សំឡេងពិត!' : 'Tap animal body parts to paint and hear realistic sounds!')
                  : activeModule === 'tracing'
                  ? (language === 'km' ? 'គូសតាមចំណុចផ្កាយមាសដើម្បីឈ្នះចេក!' : 'Follow the star to trace and win bananas!')
                  : activeModule === 'counting'
                  ? (language === 'km' ? 'រាប់ឱ្យបានត្រឹមត្រូវណា កូនពូកែ!' : 'Count carefully into the woven basket!')
                  : undefined
              }
            />

            {/* Module Switcher Buttons (Icon-Driven with vibrant bouncy cards) */}
            <div className="w-full grid grid-cols-7 gap-1 bg-white/80 p-1.5 rounded-3xl border-2 border-amber-200 shadow-sm">
              {[
                { id: 'animal_coloring', icon: Palette, labelKm: 'សត្វពិត', labelEn: 'Animals' },
                { id: 'tracing', icon: PenTool, labelKm: 'គូស', labelEn: 'Trace' },
                { id: 'counting', icon: Apple, labelKm: 'រាប់', labelEn: 'Count' },
                { id: 'voice_coach', icon: Mic, labelKm: 'និយាយ', labelEn: 'Voice' },
                { id: 'parent_voice', icon: Heart, labelKm: 'គ្រួសារ', labelEn: 'Parents' },
                { id: 'sticker_board', icon: Sparkles, labelKm: 'ស្ទីគ័រ', labelEn: 'Stickers' },
                { id: 'adaptive_review', icon: BrainCircuit, labelKm: 'ពិន្ទុ', labelEn: 'Review' },
              ].map((m) => {
                const Icon = m.icon;
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setActiveModule(m.id as any);
                      soundEffects.playPop();
                    }}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition transform active:scale-90 ${
                      isActive
                        ? 'bg-emerald-500 text-white font-black shadow-md scale-105'
                        : 'text-slate-600 hover:bg-emerald-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-extrabold leading-none truncate w-full text-center">
                      {language === 'km' ? m.labelKm : m.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MODULE: Realistic Animal Coloring & Painting Canvas (ផាត់ពណ៌តាមរូបសត្វពិតៗ) */}
            {activeModule === 'animal_coloring' && (
              <RealisticAnimalColoringCanvas
                language={language}
                onCompleteAnimal={(animalId) => {
                  setStars((prev) => prev + 2);
                  setBananas((prev) => prev + 2);
                  setMascotHappiness((prev) => Math.min(100, prev + 15));
                }}
              />
            )}

            {/* MODULE 1: Interactive Tracing Canvas (The Star Feature) */}
            {activeModule === 'tracing' && (
              <div className="w-full flex flex-col items-center">
                {/* Curriculum Sub-Category Pill Selector */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => {
                      setCurriculumTab('km_letters');
                      setSelectedItemIndex(0);
                      soundEffects.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition ${
                      curriculumTab === 'km_letters'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    🇰🇭 ព្យញ្ជនៈខ្មែរ (33)
                  </button>
                  <button
                    onClick={() => {
                      setCurriculumTab('en_letters');
                      setSelectedItemIndex(0);
                      soundEffects.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition ${
                      curriculumTab === 'en_letters'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    🇺🇸 English A-Z
                  </button>
                  <button
                    onClick={() => {
                      setCurriculumTab('numbers');
                      setSelectedItemIndex(0);
                      soundEffects.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-black transition ${
                      curriculumTab === 'numbers'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    🔢 {language === 'km' ? 'លេខ (0-9)' : 'Numbers (0-9)'}
                  </button>
                </div>

                {/* Character Carousel Tray */}
                <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-2 px-1">
                  {currentItems.map((it, idx) => {
                    const charLabel = 'char' in it ? it.char : it.khmerNumeral;
                    const isSelected = idx === selectedItemIndex;
                    return (
                      <button
                        key={'id' in it ? it.id : it.number}
                        onClick={() => {
                          setSelectedItemIndex(idx);
                          soundEffects.playPop();
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 transition transform active:scale-95 ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-200 scale-105 font-["Kantumruy_Pro"]'
                            : 'bg-white text-slate-700 hover:bg-amber-50 border-2 border-amber-200 font-["Kantumruy_Pro"]'
                        }`}
                      >
                        {charLabel}
                      </button>
                    );
                  })}
                </div>

                {/* The Tracing Canvas Widget */}
                <TracingCanvas
                  item={currentItem}
                  language={language}
                  onComplete={handleTraceCompleted}
                  onNext={handleNextItem}
                />
              </div>
            )}

            {/* MODULE 2: Counting Basket Math Game */}
            {activeModule === 'counting' && (
              <CountingBasketGame
                language={language}
                onEarnReward={() => {
                  setStars((prev) => prev + 1);
                  setBananas((prev) => prev + 1);
                }}
              />
            )}

            {/* MODULE 3: AI Voice Pronunciation Coach */}
            {activeModule === 'voice_coach' && (
              <AiPronunciationCoach
                item={'char' in currentItem ? currentItem : KHMER_CONSONANTS[0]}
                language={language}
                onEarnStar={() => setStars((prev) => prev + 1)}
              />
            )}

            {/* MODULE 4: Parent Custom Audio Recorder */}
            {activeModule === 'parent_voice' && (
              <ParentVoiceRecorder
                language={language}
                currentLetterName={'char' in currentItem ? currentItem.nameKm : currentItem.khmerWord}
              />
            )}

            {/* MODULE 5: Free-Draw Sticker Board Scene Creator */}
            {activeModule === 'sticker_board' && (
              <StickerBoard
                language={language}
                unlockedStickers={unlockedStickers}
              />
            )}

            {/* MODULE 6: Smart Adaptive Review Loop Dashboard */}
            {activeModule === 'adaptive_review' && (
              <AdaptiveReviewDashboard
                language={language}
                onSelectReviewItem={handleSelectReviewItem}
              />
            )}
          </div>
        )}

        {/* VIEW 2: Complete Comprehensive PRD Viewer */}
        {viewMode === 'prd' && <PrdViewer />}

        {/* VIEW 3: Production-Ready Flutter Architecture & Code Deliverables */}
        {viewMode === 'flutter_code' && <FlutterArchitectureViewer />}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-amber-200/80 bg-white/70 py-4 text-center text-xs text-slate-500">
        <p className="font-bold text-amber-900">
          Kumnit Kids (គំនិតកុមារ) • Designed for Preschool & Kindergarten Bilingual Excellence (Ages 3–6)
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Surpassing legacy apps with 60 FPS CustomPainter tracing, AI speech coaching, family voice recordings & spaced-repetition loops.
        </p>
      </footer>

      {/* Android Phone & APK Installation Modal */}
      <AndroidInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        language={language}
      />
    </div>
  );
}
