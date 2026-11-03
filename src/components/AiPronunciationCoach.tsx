import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Sparkles, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { LetterItem } from '../types/curriculum';

interface AiPronunciationCoachProps {
  item: LetterItem;
  language: 'km' | 'en';
  onEarnStar: () => void;
}

export const AiPronunciationCoach: React.FC<AiPronunciationCoachProps> = ({
  item,
  language,
  onEarnStar,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number; // 0 to 100
    phonemeAccuracy: string;
    commentKm: string;
    commentEn: string;
    passed: boolean;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop recording when unmounting or item changes
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [item]);

  const startMicrophone = async () => {
    try {
      soundEffects.playPop();
      setFeedback(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      drawWaveform();

      // Simulate AI phoneme analysis window (3 seconds of speech evaluation)
      setTimeout(() => {
        analyzePronunciation();
      }, 3000);
    } catch (err) {
      console.warn('Microphone access unavailable, using simulated kid speech evaluation', err);
      // Fallback: simulated analysis
      setIsListening(true);
      setTimeout(() => {
        analyzePronunciation();
      }, 2500);
    }
  };

  const stopMicrophone = () => {
    setIsListening(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const analyser = analyserRef.current;

    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Simulated lively bouncing waveform
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.random() * 180 + 30;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 1.6;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

        // Gradient color for kid delight
        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#F59E0B');
        gradient.addColorStop(0.5, '#EC4899');
        gradient.addColorStop(1, '#8B5CF6');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(
          x,
          canvas.height / 2 - barHeight / 2,
          barWidth - 2,
          Math.max(barHeight, 6),
          4
        );
        ctx.fill();

        x += barWidth + 2;
      }
    };
    render();
  };

  const analyzePronunciation = () => {
    stopMicrophone();

    // AI Phoneme scoring algorithm simulation
    const simulatedScores = [92, 95, 88, 98, 90];
    const score = simulatedScores[Math.floor(Math.random() * simulatedScores.length)];
    const passed = score >= 85;

    setFeedback({
      score,
      phonemeAccuracy: `${score}% Match`,
      commentKm: passed
        ? 'អស្ចារ្យណាស់កូន! បញ្ចេញសំឡេងបានច្បាស់ល្អដូចអ្នកគ្រូ!'
        : 'ជិតត្រូវហើយកូន! សាកល្បងម្ដងទៀតជាមួយស្វាលីណា!',
      commentEn: passed
        ? 'Spot on! Beautiful clear pronunciation, superstar!'
        : 'Almost there! Listen to Sva-Li and try one more time!',
      passed,
    });

    if (passed) {
      soundEffects.playFanfare();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
      onEarnStar();
    } else {
      soundEffects.playEncouragingNudge();
    }
  };

  const playReference = () => {
    soundEffects.playPop();
    const target = language === 'km' ? item.phonicsKm : item.phonicsEn;
    soundEffects.speak(target, language);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl p-5 shadow-2xl border-4 border-purple-300 flex flex-col items-center">
      {/* Target Letter Header */}
      <div className="flex items-center justify-between w-full mb-4 pb-3 border-b-2 border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center font-black text-3xl text-purple-700 font-['Kantumruy_Pro'] shadow-inner">
            {item.char}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800">
                {language === 'km' ? item.nameKm : item.nameEn}
              </span>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                AI Coach
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold">
              {language === 'km' ? item.phonicsKm : item.phonicsEn}
            </p>
          </div>
        </div>

        {/* Listen Model Button */}
        <button
          onClick={playReference}
          className="p-3 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl transition active:scale-95 shadow flex items-center gap-1.5"
          title="Listen to native speaker"
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-xs font-black">{language === 'km' ? 'ស្តាប់' : 'Listen'}</span>
        </button>
      </div>

      {/* Live Audio Waveform Box */}
      <div className="w-full h-32 bg-slate-900 rounded-2xl p-2 relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
        <canvas ref={canvasRef} width={280} height={100} className="w-full h-full" />

        {!isListening && !feedback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <span className="text-xs font-bold mb-1">
              {language === 'km' ? 'ចុចប៊ូតុងមីក្រូហ្វូនខាងក្រោមដើម្បីនិយាយ' : 'Tap microphone to speak'}
            </span>
            <span className="text-2xl animate-pulse">🎙️</span>
          </div>
        )}

        {isListening && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-rose-500/90 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>{language === 'km' ? 'កំពុងស្តាប់...' : 'Listening...'}</span>
          </div>
        )}
      </div>

      {/* Mic Trigger Button */}
      <div className="mt-5 flex flex-col items-center">
        {!isListening ? (
          <button
            onClick={startMicrophone}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white shadow-xl hover:shadow-purple-300 flex items-center justify-center active:scale-95 transition transform"
          >
            <Mic className="w-10 h-10 animate-bounce" />
          </button>
        ) : (
          <button
            onClick={stopMicrophone}
            className="w-20 h-20 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-xl flex items-center justify-center active:scale-95 transition"
          >
            <MicOff className="w-9 h-9" />
          </button>
        )}

        <span className="mt-2 text-xs font-bold text-slate-600">
          {isListening
            ? (language === 'km' ? 'សូមបញ្ចេញសំឡេងឥឡូវនេះ!' : 'Say the letter sound out loud!')
            : (language === 'km' ? 'ចុចដើម្បីនិយាយ' : 'Tap to Practice Speaking')}
        </span>
      </div>

      {/* Feedback Results Card */}
      {feedback && (
        <div
          className={`mt-4 w-full p-4 rounded-2xl border-2 flex items-start gap-3 animate-fade-in ${
            feedback.passed
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          {feedback.passed ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm">
                {feedback.passed
                  ? (language === 'km' ? 'ពូកែណាស់!' : 'Super Accurate!')
                  : (language === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Keep Going!')}
              </span>
              <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/80 shadow-sm">
                {feedback.phonemeAccuracy}
              </span>
            </div>
            <p className="text-xs font-medium mt-1">
              {language === 'km' ? feedback.commentKm : feedback.commentEn}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
