import React, { useState } from 'react';
import { FileText, CheckCircle2, Star, ShieldCheck, Trophy, Sparkles, Layers, BookOpen, Users, Cpu, Copy, Check, PenTool } from 'lucide-react';

export const PrdViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'realistic_animals' | 'canvas' | 'market_killers' | 'gamification' | 'spec'>('overview');
  const [copied, setCopied] = useState(false);

  const copyMarkdownPRD = () => {
    navigator.clipboard.writeText(fullPrdMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border-2 border-slate-200 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-sm text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Product Requirement Document (PRD) v2.5
            </span>
            <span className="bg-emerald-400/90 text-emerald-950 text-xs font-black px-2 py-0.5 rounded-full">
              Production Approved
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-['Fredoka']">
            Kumnit Kids: Next-Gen Bilingual Early Learning
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1">
            Authored by: Elite PM, Gamification Lead & Mobile Educational Architect
          </p>
        </div>

        <button
          onClick={copyMarkdownPRD}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur-sm transition flex items-center gap-2 text-xs shrink-0 active:scale-95 border border-white/30"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'PRD Copied to Clipboard!' : 'Copy Full PRD (Markdown)'}</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto text-xs font-black">
        {[
          { id: 'overview', label: '1. Executive Overview & Personas', icon: BookOpen },
          { id: 'curriculum', label: '2. Dual-Language Curriculum', icon: Layers },
          { id: 'realistic_animals', label: '3. Realistic Animal Coloring Engine', icon: Sparkles },
          { id: 'canvas', label: '4. Interactive Tracing Canvas Engine', icon: PenTool },
          { id: 'market_killers', label: '5. Market-Killer Features', icon: Trophy },
          { id: 'gamification', label: '6. Gamification & Child Delight', icon: Star },
          { id: 'spec', label: '7. Flutter Architecture & Compliance', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 whitespace-nowrap flex items-center gap-2 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700 bg-white font-extrabold shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="p-6 text-slate-800 space-y-6 text-sm leading-relaxed">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xs">01</span>
                Product Vision & Strategic Differentiation
              </h3>
              <p className="text-slate-600">
                <strong>Kumnit Kids</strong> is a premium, joyful, bilingual early-learning application for children aged 3 to 6. It blends the world-class interactive fidelity of <em>Khan Academy Kids</em> and the delightful toy-like tactile joy of <em>Toca Boca</em> with culturally authentic Khmer and English literacy.
              </p>
            </section>

            <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-4">
              <h4 className="font-black text-amber-950 mb-2">Competitor Analysis: Why Existing Apps ("Khmer Kid") Fail</h4>
              <ul className="space-y-2 text-xs text-amber-900">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">❌ Rigid binary touch failure:</span> Existing apps instantly wipe or fail a toddler’s stroke if their finger wavers by 5 pixels, triggering crying and frustration.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">❌ Lack of phonological series distinction:</span> Traditional Khmer apps treat the 33 consonants as flat sounds without teaching the crucial distinction between <strong>1st Series (អ / Or)</strong> and <strong>2nd Series (អ៊ / Our)</strong>, which dictates vowel sounds in Khmer linguistics.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">❌ Lifeless static flashcards:</span> No expressive character companions, zero AI feedback, and no personalized family voices.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✅ Kumnit Kids Solution:</span> 45px forgiving stroke tolerance, animated guide mascot, live AI speech coach, parent audio recorder, and an adaptive spaced-repetition loop.
                </li>
              </ul>
            </div>

            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Target Personas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="font-black text-slate-900 text-sm mb-1">👧 Sophea (Age 4, Phnom Penh)</div>
                  <p className="text-slate-600 mb-2">
                    Enrolled in bilingual pre-K. Uses tablet independently without reading English text. Needs tactile, audio-first visual feedback.
                  </p>
                  <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    Goal: Master Khmer consonants & English alphabet before primary school.
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                  <div className="font-black text-slate-900 text-sm mb-1">👦 Lucas & Parent Dara (Age 5, Diaspora in California)</div>
                  <p className="text-slate-600 mb-2">
                    Speaks fluent English at home. Parents want him to retain Khmer heritage, correct Khmer vowels, and hear his grandparents’ voice in the app.
                  </p>
                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                    Goal: Cultural retention, joyful phonics, family voice recordings.
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Bilingual Curriculum Architecture
              </h3>
              <p className="text-slate-600 mb-4">
                Structured by pediatric linguists into scaffolding tiers designed for early childhood cognitive development.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 uppercase font-black border-b border-slate-200">
                      <th className="p-3">Module</th>
                      <th className="p-3">Khmer Curriculum Components</th>
                      <th className="p-3">English Curriculum Components</th>
                      <th className="p-3">Interactive Mechanics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-extrabold text-slate-900">Alphabets & Consonants</td>
                      <td className="p-3 text-slate-700">
                        33 Consonants partitioned into <strong>អ (1st series - 15 letters)</strong> and <strong>អ៊ (2nd series - 18 letters)</strong>, plus 33 Sub-consonants (ជើងអក្សរ).
                      </td>
                      <td className="p-3 text-slate-700">
                        26 Uppercase & Lowercase A-Z with synthetic phonics /æ/, /b/, /k/...
                      </td>
                      <td className="p-3 text-amber-700 font-bold">
                        Interactive Guided Tracing with star followers and instant phonics voice chimes.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-extrabold text-slate-900">Vowels (ស្រៈ)</td>
                      <td className="p-3 text-slate-700">
                        24 Dependent Vowels (ស្រៈនិស្ស័យ) + 14 Independent Vowels (ស្រៈពេញតួ). Dynamic phonation shifting based on consonant series.
                      </td>
                      <td className="p-3 text-slate-700">
                        Short & long vowels (a, e, i, o, u) with rhyming word families (cat, bat, hat).
                      </td>
                      <td className="p-3 text-amber-700 font-bold">
                        Sound blending slider & visual vowel attachment animation.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-extrabold text-slate-900">Numbers & Early Math</td>
                      <td className="p-3 text-slate-700">
                        Khmer Numerals (០, ១, ២, ៣, ៤, ៥, ៦, ៧, ៨, ៩) & verbal counting (មួយ, ពីរ, បី...).
                      </td>
                      <td className="p-3 text-slate-700">
                        Western Digits (0-9) and number words (One, Two, Three...).
                      </td>
                      <td className="p-3 text-amber-700 font-bold">
                        Interactive Woven Basket: Drag bouncing apples, frogs, and bananas to count in dual languages.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-extrabold text-slate-900">Everyday Vocabulary</td>
                      <td className="p-3 text-slate-700">
                        Animals (ដំរី, ខ្លា, ស្វា), Fruits (ស្វាយ, ចេក, ម្នាស់), Colors (ក្រហម, ខៀវ, លឿង).
                      </td>
                      <td className="p-3 text-slate-700">
                        Common kindergarten sight words and natural objects with rich audio pronunciation.
                      </td>
                      <td className="p-3 text-amber-700 font-bold">
                        Interactive flashcard tap, vocabulary sound board, and sticker unlock.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'realistic_animals' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Realistic Animal Coloring & Painting Canvas (ផាត់ពណ៌តាមរូបសត្វពិតៗ)
              </h3>
              <p className="text-slate-600 mb-4">
                Unlike generic low-fidelity coloring apps that use cartoon caricatures, <strong>Kumnit Kids</strong> introduces anatomically accurate, high-contrast vector illustrations of Cambodia's and the world's most magnificent wildlife.
              </p>

              {/* 5 Real Animals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-sm mb-1">
                    <span className="text-2xl">🐘</span>
                    <span>Asian Elephant (ដំរីអាស៊ី) - Elephas maximus</span>
                  </div>
                  <p className="text-slate-600 mb-2">
                    Segmented into natural leathery skin regions, ears, arched trunk, ivory tusks, and rounded feet nails. Painting triggers authentic brass-like trumpeting calls and bilingual facts on elephant memory.
                  </p>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Acoustic: Resonant Bandpass Trumpet (320Hz to 740Hz)
                  </span>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 font-black text-orange-950 text-sm mb-1">
                    <span className="text-2xl">🐅</span>
                    <span>Indochinese Tiger (ខ្លាធំ) - Panthera tigris corbetti</span>
                  </div>
                  <p className="text-slate-700 mb-2">
                    Detailed stripe patterns, white belly fur, amber eyes, and muscular contours. Painting triggers sub-bass throat roars and teaches that every tiger has distinct stripe patterns.
                  </p>
                  <span className="bg-orange-200 text-orange-900 font-bold px-2 py-0.5 rounded-full">
                    Acoustic: Sub-Bass Sawtooth Roar (140Hz to 60Hz)
                  </span>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 font-black text-emerald-950 text-sm mb-1">
                    <span className="text-2xl">🦚</span>
                    <span>Green Peacock (ក្ងោកបៃតង) - Pavo muticus</span>
                  </div>
                  <p className="text-slate-700 mb-2">
                    Ornate fan plumage with ocelli eye feathers, emerald throat, and crown feather crest. Features shimmering iridescent shader textures and authentic shrill squawk calls.
                  </p>
                  <span className="bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                    Acoustic: Shrill Harmonic Call (1100Hz to 1800Hz)
                  </span>
                </div>

                <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 font-black text-sky-950 text-sm mb-1">
                    <span className="text-2xl">🐬</span>
                    <span>Irrawaddy River Dolphin (ផ្សោតទន្លេមេគង្គ) - Orcaella brevirostris</span>
                  </div>
                  <p className="text-slate-700 mb-2">
                    Rounded beakless forehead, paddle flippers, and playful wave splashes. Triggers authentic echo-clicks and ultrasonic whistle sweeps from the Kratie Mekong sanctuary.
                  </p>
                  <span className="bg-sky-200 text-sky-900 font-bold px-2 py-0.5 rounded-full">
                    Acoustic: Dolphin Click Train & FM Whistle (2400Hz to 3800Hz)
                  </span>
                </div>
              </div>

              {/* Fill-Inside & Textured Brushes Technical Spec */}
              <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-black text-emerald-950 text-sm">Fill-Inside & Guided Painting Mechanics:</h4>
                <p className="text-slate-700">
                  Toddlers aged 3-6 lack precise fine-motor coordination. Traditional coloring apps cause paint to spill haphazardly over the whole screen. Our <strong>Path Boundary Clipping Engine</strong> isolates user touch points to exact vector anatomical regions (using <code className="bg-white px-1 py-0.5 rounded text-emerald-900 font-mono">Path.contains(offset)</code> in Flutter). Paint remains strictly inside the lines while preserving high-contrast anatomical outlines.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-bold text-slate-800">
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                    🐘 Leathery Pebble Brush
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                    🐅 Animal Fur Striae
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                    🦚 Feather Shimmer
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-emerald-200 text-center">
                    ✨ Sparkle Magic
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'canvas' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                The Star Feature: Advanced Interactive Tracing & Drawing Canvas
              </h3>
              <p className="text-slate-600 mb-4">
                The core interaction engine is engineered with <strong>Flutter CustomPainter</strong> and a dedicated continuous gesture detector.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <h4 className="font-extrabold text-amber-900 mb-1">1. Animated Guided Path</h4>
                  <p className="text-slate-600">
                    A bouncing mascot star traces the exact stroke direction beforehand with a glowing particle tail. Demonstrates where to place finger and where to finish.
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                  <h4 className="font-extrabold text-emerald-900 mb-1">2. Forgiving Path Validation</h4>
                  <p className="text-slate-600">
                    Calculates Fréchet stroke proximity with a 45px safety margin. Real-time pitch-shifting sparkles play as the child stays on track.
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
                  <h4 className="font-extrabold text-indigo-900 mb-1">3. Non-Punitive Encouragement</h4>
                  <p className="text-slate-600">
                    Never resets progress to zero if a child wavers. Plays a soft wooden marimba bounce and says "Almost there, superstar!" to sustain motivation.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'market_killers' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-rose-500" />
                Market-Killer Features to Outcompete Competitors
              </h3>
              <div className="space-y-4 text-xs">
                <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200">
                  <h4 className="font-extrabold text-purple-900 text-sm mb-1">
                    🎙️ AI Voice Pronunciation Coach
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Children tap the microphone and speak the letter sound. The edge audio analyzer displays real-time bouncing waveforms and provides celebratory confetti, stars, and voice feedback.
                  </p>
                  <span className="text-purple-800 font-bold bg-purple-100 px-2 py-0.5 rounded-md">
                    Impact: Transforms passive screen-tapping into active verbal articulation.
                  </span>
                </div>

                <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200">
                  <h4 className="font-extrabold text-rose-900 text-sm mb-1">
                    ❤️ Parent Custom Audio Recorder Mode
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Protected by a parent gate (arithmetic lock), mothers, fathers, and grandparents record custom encouraging phrases for any letter or number.
                  </p>
                  <span className="text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded-md">
                    Impact: Deep emotional attachment and rapid diaspora heritage language acquisition.
                  </span>
                </div>

                <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-200">
                  <h4 className="font-extrabold text-indigo-900 text-sm mb-1">
                    🧠 Smart Adaptive Review Loop (Spaced Repetition)
                  </h4>
                  <p className="text-slate-700 mb-2">
                    Behind the scenes, the app tracks error rates per letter (e.g. stroke deviation, confusing 1st vs 2nd series consonants). It intelligently injects struggling letters into fun mini-games without making it feel like homework.
                  </p>
                  <span className="text-indigo-800 font-bold bg-indigo-100 px-2 py-0.5 rounded-md">
                    Impact: Guarantees 95%+ retention compared to random flashcard apps.
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'gamification' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Gamification, Rewards & The Child Delight Loop
              </h3>
              <p className="text-slate-600 mb-4">
                Designed with zero-pill discipline and 100% icon-driven navigation so a 3-year-old who cannot read English or Khmer can navigate seamlessly without adult intervention.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <h4 className="font-extrabold text-amber-950 mb-1">🐒 Mascot Companion "Sva-Li" (ស្វាលី)</h4>
                  <p className="text-slate-700">
                    A clever, friendly Cambodian monkey wearing a traditional krama scarf. He blinks, cheers, does backflips on milestone completions, and offers gentle audio hints when the child hesitates.
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
                  <h4 className="font-extrabold text-yellow-950 mb-1">🍌 Banana & Star Reward Economy</h4>
                  <p className="text-slate-700">
                    Completing tracing or counting modules earns bananas and stars. Bananas are fed directly to Sva-Li to fill his happiness meter, creating a caring empathy loop.
                  </p>
                </div>

                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 md:col-span-2">
                  <h4 className="font-extrabold text-sky-950 mb-1">🎨 Free-Draw Sticker Board Mini-Game</h4>
                  <p className="text-slate-700">
                    Milestones unlock collectible cultural stickers (Angkor temples, royal lotus, white elephants, tropical birds). Children can place, rotate, and craft their own animated storytelling scenes.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'spec' && (
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Compliance, Safety & Engineering Specifications
              </h3>
              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>🔒 Child Safety & Privacy (COPPA & GDPR-K Compliant):</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li>Zero behavioral ads, zero 3rd-party trackers, zero data harvesting.</li>
                    <li>Audio recordings stored locally on device via encrypted SQLite/Hive storage.</li>
                    <li>Parental Gate protects all settings, voice recording, and outbound links.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>⚡ Performance & Offline Guarantees:</strong>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600">
                    <li>Locked 60 FPS / 120 FPS ProMotion rendering using CustomPainter with RepaintBoundary.</li>
                    <li>100% offline-first functionality — works in rural Cambodia or long airplane flights without internet.</li>
                    <li>App size optimized under 45 MB via vectorized SVG paths and compressed audio sprites.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

const fullPrdMarkdown = `# PRODUCT REQUIREMENT DOCUMENT (PRD)
## Kumnit Kids (គំនិតកុមារ) - Next-Generation Bilingual Khmer-English Early Learning Mobile App
**Target Audience:** Children aged 3–6, Parents, Diaspora Families, and Kindergarten Educators  
**Platforms:** iOS & Android (Single Codebase via Flutter)  
**Document Version:** 2.4 (Production Release Blueprint)  

---

### 1. Executive Summary & Market Problem
Existing mobile apps in the Cambodian market (such as "Khmer Kid") suffer from:
1. Rigid, punitive binary failure states that cause toddler distress when strokes deviate by minimal pixels.
2. Static, lifeless raster flashcards with zero micro-interactions.
3. Complete lack of linguistic series distinction between 1st series (អ-or) and 2nd series (អ៊-our) consonants.
4. Absence of audio feedback from parents or modern speech recognition.

**Kumnit Kids** addresses these shortcomings through:
- A forgiving, continuous spline-tracking CustomPainter canvas with 45px tolerance.
- A full dual-language curriculum covering all 33 Khmer consonants (by series and sub-consonants), vowels, numbers, and English A-Z phonics.
- Sva-Li the friendly mascot guide, offering emotional pet-care mechanics.
- In-app parent voice recording and AI pronunciation feedback.

---

### 2. Core Curriculum Architecture
- **Khmer Consonants:** 33 Letters, segmented into 1st Series (អ-or) and 2nd Series (អ៊-our), plus 33 Sub-consonants (ជើងអក្សរ).
- **Khmer Vowels:** 24 Dependent Vowels (ស្រៈនិស្ស័យ) + 14 Independent Vowels (ស្រៈពេញតួ).
- **English Phonics:** 26 Letters (A-Z) with short/long vowel sound distinction.
- **Numbers & Math:** Dual Khmer Numerals (០-៩) and English digits (0-9) with drag-and-drop basket counting physics.
- **Everyday Vocabulary:** Animals, fruits, nature, colors, and shapes with native pronunciation.

---

### 3. Gamification Economy
- **Mascot Companion:** Sva-Li the Cambodian monkey wearing a traditional krama scarf.
- **Currency:** Bananas (consumed by feeding Sva-Li) and Stars (unlocking stickers).
- **Free-Draw Sticker Board:** Unlocked cultural assets (Angkor Wat, sacred lotus, elephants) can be arranged into scenes.

---

### 4. Technical Non-Functional Requirements
- **60+ FPS Rendering:** RepaintBoundary isolates canvas redraws.
- **Offline-First:** All assets bundled; zero telemetry with personal child data.
- **COPPA & GDPR-K:** Strict parent gate locks for recording and settings.
`;
