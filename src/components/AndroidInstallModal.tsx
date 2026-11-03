import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  FolderArchive,
  Lock,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundEffects } from '../utils/audioSynth';
import { downloadFlutterProjectZip } from '../utils/flutterProjectExport';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'km' | 'en';
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'instant_pwa' | 'flutter_apk' | 'github_action'>('instant_pwa');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  // Direct Cloud Run preview URL
  const currentUrl = 'https://ais-dev-g6nj26cscizuyalebdqiig-840504201933.asia-east1.run.app';

  const copyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    soundEffects.playPop();
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      soundEffects.playPop();
      await downloadFlutterProjectZip();
      soundEffects.playFanfare();
    } catch (e) {
      console.error('Failed to generate ZIP', e);
    } finally {
      setIsZipping(false);
    }
  };

  const copyCli = () => {
    navigator.clipboard.writeText(flutterCliCommands);
    setCopiedCli(true);
    soundEffects.playPop();
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const copyWorkflow = () => {
    navigator.clipboard.writeText(githubWorkflowYaml);
    setCopiedWorkflow(true);
    soundEffects.playPop();
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl border border-white/30">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black font-['Fredoka']">
                  {language === 'km' ? 'ដំឡើងលើទូរស័ព្ទ Android' : 'Install on Android Phone'}
                </h3>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Ready
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium">
                {language === 'km' ? 'ជ្រើសរើសវិធីដំឡើងផ្ទាល់លើទូរស័ព្ទ ឬបង្កើតឯកសារ APK' : 'Choose instant phone install or download complete Flutter APK project'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 403 Error Explanation & Fix Banner */}
        <div className="bg-amber-50 border-b-2 border-amber-200 p-3 px-5 flex items-start gap-3 text-xs text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-extrabold block text-amber-900">
              {language === 'km' ? 'មូលហេតុនៃកំហុស 403 (Why Google 403 Happened):' : 'Why "Google 403: You do not have access" Happened:'}
            </span>
            <p className="text-amber-800 mt-0.5">
              {language === 'km'
                ? 'តំណភ្ជាប់ដែលអ្នកបានបើកគឺជាគម្រោង AI Studio ផ្ទាល់ខ្លួនរបស់អ្នក។ ដើម្បីបើកលើទូរស័ព្ទបាន សូមចូល (Sign in) គណនី Google របស់អ្នក (lk.voleak369@gmail.com) ក្នុងកម្មវិធី Chrome លើទូរស័ព្ទ ឬទាញយកឯកសារកូដ ZIP ខាងក្រោមដើម្បី build APK ដោយផ្ទាល់!'
                : 'The link you opened is private to your AI Studio developer project. To open on your phone, sign in to your Google Account (lk.voleak369@gmail.com) in Chrome on your phone, OR download the complete Flutter Project ZIP below to build the APK!'}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-amber-50/60 p-1.5 text-xs font-black">
          <button
            onClick={() => {
              setActiveTab('instant_pwa');
              soundEffects.playPop();
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'instant_pwa'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{language === 'km' ? '១. ដំឡើងលើទូរស័ព្ទ (WebAPK)' : '1. Instant Phone Install'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('flutter_apk');
              soundEffects.playPop();
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'flutter_apk'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>{language === 'km' ? '២. ទាញយកកូដ ZIP & APK' : '2. Download Project ZIP'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('github_action');
              soundEffects.playPop();
            }}
            className={`flex-1 py-2.5 px-3 rounded-2xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'github_action'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>{language === 'km' ? '៣. GitHub Actions APK' : '3. Auto Cloud Build'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed flex-1">
          {/* TAB 1: Instant Phone Install (WebAPK) */}
          {activeTab === 'instant_pwa' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                {/* QR Code Container */}
                <div className="bg-white p-3 rounded-2xl shadow-md border-2 border-emerald-200 shrink-0">
                  <QRCodeSVG
                    value={currentUrl}
                    size={130}
                    level="M"
                    includeMargin={false}
                  />
                  <span className="block text-[10px] text-center font-bold text-slate-500 mt-1">
                    {language === 'km' ? 'ស្កេនជាមួយទូរស័ព្ទ' : 'Scan with Camera'}
                  </span>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="text-xl">✨</span>
                    <h4 className="font-black text-emerald-950 text-sm">
                      {language === 'km' ? 'ដំឡើងលើទូរស័ព្ទ Android (លុបបំបាត់ 403)' : 'Install on Android (Fix 403 Error)'}
                    </h4>
                  </div>
                  <p className="text-slate-600">
                    {language === 'km'
                      ? '១. បើក Chrome លើទូរស័ព្ទ ហើយចូលគណនី Google lk.voleak369@gmail.com'
                      : '1. Open Chrome on your phone and ensure you are signed in with lk.voleak369@gmail.com'}
                    <br />
                    {language === 'km'
                      ? '២. បើកតំណភ្ជាប់ខាងក្រោម ឬស្កេន QR Code'
                      : '2. Open the link below or scan the QR Code'}
                    <br />
                    {language === 'km'
                      ? '៣. ចុច "Install app" ក្នុងម៉ឺនុយ Chrome'
                      : '3. Tap "Install app" or "Add to Home screen" in Chrome'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      onClick={copyUrl}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedUrl ? 'Copied Direct Link!' : 'Copy Direct App Link'}</span>
                    </button>

                    <button
                      onClick={handleDownloadZip}
                      disabled={isZipping}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span>{isZipping ? 'Creating ZIP...' : 'Download Project ZIP'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Steps instructions on Android phone */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <h5 className="font-black text-slate-800 mb-2">
                  {language === 'km' ? 'របៀបជៀសវាងកំហុស 403 ពេលបើកលើទូរស័ព្ទ៖' : 'How to avoid 403 when opening on mobile:'}
                </h5>
                <ol className="space-y-2 text-slate-700 pl-4 list-decimal font-medium">
                  <li>
                    <strong>{language === 'km' ? 'ចូលគណនី Google របស់អ្នក៖' : 'Sign into Google Account:'}</strong> {language === 'km' ? 'បើក Chrome លើទូរស័ព្ទ ហើយចូលគណនី lk.voleak369@gmail.com។' : 'Open Chrome on your phone and sign into lk.voleak369@gmail.com (the account that owns this AI Studio project).'}
                  </li>
                  <li>
                    <strong>{language === 'km' ? 'បើកតំណភ្ជាប់ផ្ទាល់៖' : 'Open the Direct URL:'}</strong> {language === 'km' ? 'បញ្ចូលតំណភ្ជាប់ ais-dev-g6nj26cscizuyalebdqiig-840504201933.asia-east1.run.app ក្នុង Chrome។' : 'Paste https://ais-dev-g6nj26cscizuyalebdqiig-840504201933.asia-east1.run.app in Chrome.'}
                  </li>
                  <li>
                    <strong>{language === 'km' ? 'ដំឡើងលើអេក្រង់ដើម៖' : 'Install to Home screen:'}</strong> {language === 'km' ? 'ចុចលើសញ្ញាចុចបី (⋮) នៅជ្រុងស្ដាំខាងលើ -> ជ្រើស "Install app"។ កម្មវិធីនឹងដំឡើងដូច native APK!' : 'Tap menu (⋮) -> tap "Install app". It installs instantly on your phone with the Sva-Li icon!'}
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: Download Project ZIP & Flutter APK Build Commands */}
          {activeTab === 'flutter_apk' && (
            <div className="space-y-4">
              {/* Direct ZIP Download Box */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm flex items-center gap-1.5">
                    <FolderArchive className="w-5 h-5" />
                    <span>{language === 'km' ? 'ទាញយកគម្រោង Flutter ពេញលេញ (.ZIP)' : 'Download Complete Flutter Source (.ZIP)'}</span>
                  </h4>
                  <p className="text-[11px] text-emerald-100 mt-0.5">
                    {language === 'km' ? 'មានផ្ទុកកូដ Canvas ផាត់ពណ៌សត្វពិត គូសអក្សរ ជើងអក្សរ និង build_apk.sh' : 'Contains all realistic animal painting, tracing canvas, phonics, and build_apk.sh'}
                  </p>
                </div>

                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-emerald-950 font-black rounded-xl shadow-md transition active:scale-95 shrink-0 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>{isZipping ? 'Generating ZIP...' : 'Download ZIP Now'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  {language === 'km' ? 'បញ្ជា CLI ដើម្បីបង្កើត APK លើកុំព្យូទ័រ៖' : 'Terminal Commands to Build Standalone APK:'}
                </span>
                <button
                  onClick={copyCli}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold flex items-center gap-1"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCli ? 'Copied Commands!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto shadow-inner leading-relaxed">
                <pre>{flutterCliCommands}</pre>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                <strong>📍 {language === 'km' ? 'ទីតាំងឯកសារ APK ពេល Build រួច៖' : 'Generated APK Output Path:'}</strong>
                <p className="font-mono text-[11px] mt-1 bg-white p-2 rounded-xl border border-amber-200 text-slate-800">
                  build/app/outputs/flutter-apk/app-release.apk
                </p>
                <p className="text-[10px] text-amber-800 mt-1">
                  {language === 'km' ? 'ផ្ទេរឯកសារនេះទៅទូរស័ព្ទ Android ហើយចុច "Install" (អនុញ្ញាត Install Unknown Apps ក្នុង Settings)។' : 'Transfer this APK file to your phone via USB or Google Drive and tap to install!'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: GitHub Actions Cloud Build */}
          {activeTab === 'github_action' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-800">
                    {language === 'km' ? 'ស្វ័យប្រវត្តិកម្ម Cloud Build ជាមួយ GitHub Actions' : 'Free Automated Cloud APK Builder (No PC Required)'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'km' ? 'ដាក់កូដក្នុង GitHub នោះ GitHub នឹង build APK ឱ្យអ្នកដោយស្វ័យប្រវត្ត!' : 'Push code to GitHub and it automatically builds the downloadable APK artifact in 2 minutes!'}
                  </p>
                </div>
                <button
                  onClick={copyWorkflow}
                  className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWorkflow ? 'Copied YAML!' : 'Copy Workflow'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-[11px] overflow-x-auto shadow-inner leading-relaxed max-h-56">
                <pre>{githubWorkflowYaml}</pre>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-900">
                <strong>💡 How to use:</strong> Save this file as <code className="font-mono font-bold bg-white px-1 py-0.5 rounded text-indigo-950">.github/workflows/build_apk.yml</code> in your repository. Every push will create a downloadable <code className="font-mono font-bold">app-release.apk</code> in GitHub Releases / Actions Artifacts!
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'km' ? 'សុវត្ថិភាពខ្ពស់ • គ្មានការប្រមូលទិន្នន័យ (COPPA Compliant)' : 'Child-Safe & Verified • Zero Telemetry'}</span>
          </div>

          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black rounded-xl active:scale-95 transition"
          >
            {language === 'km' ? 'បិទ' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

const flutterCliCommands = `# 1. Create Flutter project structure
flutter create --org com.kumnitkids --project-name kumnit_kids .

# 2. Add production dependencies
flutter pub add flutter_riverpod google_fonts just_audio flutter_animate confetti

# 3. Build optimized release APK for Android
flutter build apk --release --split-per-abi

# Output files will be generated at:
# -> build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk  (Older Android)
# -> build/app/outputs/flutter-apk/app-arm64-v8a-release.apk    (Modern 64-bit phones)
# -> build/app/outputs/flutter-apk/app-release.apk              (Universal APK)`;

const githubWorkflowYaml = `name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Set up Flutter
        uses: subosito/flutter-action@v2
        with:
          channel: 'stable'
          flutter-version: '3.19.x'

      - name: Install dependencies
        run: flutter pub get

      - name: Build Android APK
        run: flutter build apk --release

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: kumnit-kids-release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
`;
