import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause, Trash2, Heart, CheckCircle2, Lock } from 'lucide-react';
import { soundEffects } from '../utils/audioSynth';
import { ParentRecording } from '../types/curriculum';

interface ParentVoiceRecorderProps {
  language: 'km' | 'en';
  currentLetterName: string;
}

export const ParentVoiceRecorder: React.FC<ParentVoiceRecorderProps> = ({
  language,
  currentLetterName,
}) => {
  const [isParentUnlocked, setIsParentUnlocked] = useState(false);
  const [parentGateAnswer, setParentGateAnswer] = useState('');
  const [author, setAuthor] = useState<'Mom' | 'Dad' | 'Grandma' | 'Teacher'>('Mom');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordings, setRecordings] = useState<ParentRecording[]>([
    {
      id: 'rec-sample',
      itemId: 'km-ka',
      itemLabel: 'អក្សរ ក (Ka)',
      author: 'Mom',
      audioBlobUrl: '',
      durationSec: 3,
      timestamp: 'Today',
    },
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Check parent gate
  const handleParentGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentGateAnswer.trim() === '7') {
      setIsParentUnlocked(true);
      soundEffects.playPop();
    } else {
      soundEffects.playEncouragingNudge();
    }
  };

  const startRecording = async () => {
    try {
      soundEffects.playPop();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newRec: ParentRecording = {
          id: `rec-${Date.now()}`,
          itemId: 'current',
          itemLabel: currentLetterName,
          author,
          audioBlobUrl: audioUrl,
          durationSec: recordingDuration || 3,
          timestamp: 'Just now',
        };
        setRecordings((prev) => [newRec, ...prev]);
        soundEffects.playFanfare();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      // Fallback if browser blocks microphone
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = window.setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 3) {
            stopRecording();
            return 3;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    } else {
      // Mock save
      const newRec: ParentRecording = {
        id: `rec-${Date.now()}`,
        itemId: 'current',
        itemLabel: currentLetterName,
        author,
        audioBlobUrl: '',
        durationSec: recordingDuration || 3,
        timestamp: 'Just now',
      };
      setRecordings((prev) => [newRec, ...prev]);
      soundEffects.playFanfare();
    }
    setIsRecording(false);
  };

  const playRecording = (rec: ParentRecording) => {
    if (rec.audioBlobUrl) {
      const audio = new Audio(rec.audioBlobUrl);
      setPlayingId(rec.id);
      audio.onended = () => setPlayingId(null);
      audio.play().catch(() => setPlayingId(null));
    } else {
      setPlayingId(rec.id);
      soundEffects.speak(`ម៉ាក់ស្រឡាញ់កូន! ${rec.itemLabel}`, 'km');
      setTimeout(() => setPlayingId(null), 2500);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
    soundEffects.playPop();
  };

  // If locked, render Parent Gate (COPPA compliance & accidental tap prevention)
  if (!isParentUnlocked) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl p-6 shadow-2xl border-4 border-rose-200 text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">
          {language === 'km' ? 'កន្លែងសម្រាប់អាណាព្យាបាល' : 'Grown-Ups Only Area'}
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1 mb-4">
          {language === 'km'
            ? 'ដើម្បីសុវត្ថិភាពកូន សូមឆ្លើយសំណួរគណិតវិទ្យា៖ ៤ + ៣ = ?'
            : 'To record familiar voices, please solve: 4 + 3 = ?'}
        </p>

        <form onSubmit={handleParentGateSubmit} className="flex gap-2 justify-center max-w-xs mx-auto">
          <input
            type="number"
            placeholder="?"
            value={parentGateAnswer}
            onChange={(e) => setParentGateAnswer(e.target.value)}
            className="w-20 px-3 py-2 text-center text-xl font-bold bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-rose-400 outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl active:scale-95 transition shadow"
          >
            {language === 'km' ? 'បើកសោ' : 'Unlock'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/95 rounded-3xl p-5 shadow-2xl border-4 border-rose-300 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-rose-100">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <h3 className="font-black text-rose-950 font-['Fredoka'] text-lg">
            {language === 'km' ? 'ថតសំឡេងឪពុកម្តាយ' : 'Parent Voice Studio'}
          </h3>
        </div>
        <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
          {currentLetterName}
        </span>
      </div>

      <p className="text-xs text-slate-600 mt-2 mb-3">
        {language === 'km'
          ? 'ក្មេងៗចងចាំបានលឿនជាងមុន ៣ដង នៅពេលពួកគេឮសំឡេងឪពុកម្តាយ!'
          : 'Toddlers learn 3x faster and feel emotionally secure when hearing beloved family voices!'}
      </p>

      {/* Author Select */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {(['Mom', 'Dad', 'Grandma', 'Teacher'] as const).map((role) => (
          <button
            key={role}
            onClick={() => {
              setAuthor(role);
              soundEffects.playPop();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              author === role
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
            }`}
          >
            {role === 'Mom' && '👩 '}
            {role === 'Dad' && '👨 '}
            {role === 'Grandma' && '👵 '}
            {role === 'Teacher' && '👩‍🏫 '}
            {role}
          </button>
        ))}
      </div>

      {/* Record Controller */}
      <div className="bg-rose-50 rounded-2xl p-4 flex flex-col items-center border border-rose-200">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg flex items-center justify-center active:scale-95 transition"
          >
            <Mic className="w-8 h-8" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-slate-800 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center active:scale-95 transition animate-pulse"
          >
            <Square className="w-7 h-7" />
          </button>
        )}

        <div className="mt-2 text-center">
          <span className="text-xs font-extrabold text-rose-900 block">
            {isRecording
              ? `${language === 'km' ? 'កំពុងថត៖ ' : 'Recording: '}${recordingDuration}s`
              : (language === 'km' ? `ចុចដើម្បីថតសំឡេង ${author}` : `Tap to Record ${author}'s Voice`)}
          </span>
          <span className="text-[10px] text-slate-500">
            {language === 'km' ? 'ឧទាហរណ៍៖ "កូនពូកែ! នេះជាអក្សរ ក"' : 'E.g., "Great job sweetie! Letter A says /æ/!"'}
          </span>
        </div>
      </div>

      {/* Saved Voice Clips List */}
      <div className="mt-4">
        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
          {language === 'km' ? 'សំឡេងដែលបានថតរួច' : 'Saved Family Clips'}
        </h4>

        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-rose-100 shadow-sm hover:border-rose-300 transition"
            >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => playRecording(rec)}
                  className="w-9 h-9 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center transition active:scale-95"
                >
                  {playingId === rec.id ? <Pause className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-800">{rec.author}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                      {rec.itemLabel}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{rec.durationSec}s • {rec.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => deleteRecording(rec.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition"
                title="Delete recording"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
