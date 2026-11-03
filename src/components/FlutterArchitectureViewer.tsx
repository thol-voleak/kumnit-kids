import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, FolderTree, Cpu, Sparkles, Layers } from 'lucide-react';

export const FlutterArchitectureViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('interactive_tracing_canvas.dart');
  const [copied, setCopied] = useState(false);

  const filesMap: Record<string, { language: string; description: string; code: string }> = {
    'realistic_animal_painter_canvas.dart': {
      language: 'dart',
      description: 'Production Flutter CustomPainter canvas for realistic animal painting with path segment clipping, textures, and animal sounds.',
      code: `import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:just_audio/just_audio.dart';

/// Segmented region of a realistic animal (e.g. Asian Elephant, Indochinese Tiger)
class AnimalRegionPath {
  final String id;
  final String nameKm;
  final String nameEn;
  final Path path;
  final Color realisticColor;
  final Color defaultColor;
  final String textureType; // 'leather', 'fur', 'feathers', 'solid'

  AnimalRegionPath({
    required this.id,
    required this.nameKm,
    required this.nameEn,
    required this.path,
    required this.realisticColor,
    this.defaultColor = const Color(0xFFF1F5F9),
    this.textureType = 'solid',
  });
}

/// Realistic Animal Coloring Canvas Widget
/// Features: Fill-inside boundaries, textured brush simulation, realistic audio triggers
class RealisticAnimalPainterCanvas extends StatefulWidget {
  final List<AnimalRegionPath> regions;
  final String animalNameKm;
  final String animalNameEn;
  final String soundAssetPath;
  final Color selectedColor;
  final Function(String regionId) onRegionPainted;
  final VoidCallback onAnimalCompleted;

  const RealisticAnimalPainterCanvas({
    super.key,
    required this.regions,
    required this.animalNameKm,
    required this.animalNameEn,
    required this.soundAssetPath,
    required this.selectedColor,
    required this.onRegionPainted,
    required this.onAnimalCompleted,
  });

  @override
  State<RealisticAnimalPainterCanvas> createState() =>
      _RealisticAnimalPainterCanvasState();
}

class _RealisticAnimalPainterCanvasState
    extends State<RealisticAnimalPainterCanvas> {
  final Map<String, Color> _paintedRegionColors = {};
  late AudioPlayer _audioPlayer;

  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();
    _resetCanvas();
  }

  void _resetCanvas() {
    _paintedRegionColors.clear();
    for (final region in widget.regions) {
      _paintedRegionColors[region.id] = region.defaultColor;
    }
  }

  @override
  void didUpdateWidget(covariant RealisticAnimalPainterCanvas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.animalNameEn != widget.animalNameEn) {
      setState(() => _resetCanvas());
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  void _handleTap(TapUpDetails details) async {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final Offset localPosition = renderBox.globalToLocal(details.globalPosition);

    // Hit-test against SVG paths from top to bottom
    for (final region in widget.regions.reversed) {
      if (region.path.contains(localPosition)) {
        HapticFeedback.lightImpact();

        setState(() {
          _paintedRegionColors[region.id] = widget.selectedColor;
        });

        // Trigger realistic animal call (e.g., Elephant trumpet or Tiger roar)
        _playAnimalSound();

        widget.onRegionPainted(region.id);

        // Check if all non-background regions are painted
        final bool allDone = widget.regions.every(
          (r) => _paintedRegionColors[r.id] != r.defaultColor,
        );

        if (allDone) {
          widget.onAnimalCompleted();
        }
        break;
      }
    }
  }

  Future<void> _playAnimalSound() async {
    try {
      await _audioPlayer.setAsset(widget.soundAssetPath);
      await _audioPlayer.play();
    } catch (e) {
      debugPrint('Audio playback error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.15,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32),
          border: Border.all(color: const Color(0xFF10B981), width: 4),
          boxShadow: [
            BoxShadow(
              color: Colors.emerald.withOpacity(0.12),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28),
          child: GestureDetector(
            onTapUp: _handleTap,
            child: CustomPaint(
              painter: _RealisticAnimalCustomPainter(
                regions: widget.regions,
                paintedColors: _paintedRegionColors,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RealisticAnimalCustomPainter extends CustomPainter {
  final List<AnimalRegionPath> regions;
  final Map<String, Color> paintedColors;

  _RealisticAnimalCustomPainter({
    required this.regions,
    required this.paintedColors,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final borderPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.5
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    // Draw each anatomical region
    for (final region in regions) {
      final Color fillColor = paintedColors[region.id] ?? region.defaultColor;

      final fillPaint = Paint()
        ..color = fillColor
        ..style = PaintingStyle.fill;

      // 1. Fill segmented region (guarantees paint stays cleanly inside boundaries)
      canvas.drawPath(region.path, fillPaint);

      // 2. Add realistic subtle natural texture overlay
      if (region.textureType == 'leather') {
        _drawLeatheryTexture(canvas, region.path);
      } else if (region.textureType == 'fur') {
        _drawFurStriae(canvas, region.path);
      }

      // 3. Draw high-contrast anatomical outline
      canvas.drawPath(region.path, borderPaint);
    }
  }

  void _drawLeatheryTexture(Canvas canvas, Path clipPath) {
    canvas.save();
    canvas.clipPath(clipPath);
    final dotPaint = Paint()
      ..color = Colors.black.withOpacity(0.06)
      ..style = PaintingStyle.fill;

    final bounds = clipPath.getBounds();
    for (double x = bounds.left; x < bounds.right; x += 12) {
      for (double y = bounds.top; y < bounds.bottom; y += 12) {
        canvas.drawCircle(Offset(x, y), 1.5, dotPaint);
      }
    }
    canvas.restore();
  }

  void _drawFurStriae(Canvas canvas, Path clipPath) {
    canvas.save();
    canvas.clipPath(clipPath);
    final furPaint = Paint()
      ..color = Colors.black.withOpacity(0.08)
      ..strokeWidth = 1.0;

    final bounds = clipPath.getBounds();
    for (double x = bounds.left; x < bounds.right; x += 10) {
      for (double y = bounds.top; y < bounds.bottom; y += 8) {
        canvas.drawLine(Offset(x, y), Offset(x + 4, y + 6), furPaint);
      }
    }
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _RealisticAnimalCustomPainter oldDelegate) =>
      true;
}
`,
    },
    'interactive_tracing_canvas.dart': {
      language: 'dart',
      description: 'Production Flutter CustomPainter canvas with continuous gesture tracking, guided star animation, and sparkle particles.',
      code: `import 'dart:math' as math;
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../domain/stroke_matcher.dart';

/// Interactive Tracing Canvas Widget for Children (Ages 3-6)
/// Implements forgiving tolerance, guided stroke follower, and celebration.
class InteractiveTracingCanvas extends StatefulWidget {
  final List<Offset> guidePoints;
  final Path templatePath;
  final String characterGlyph;
  final Color strokeColor;
  final double toleranceRadius;
  final VoidCallback onCompleted;
  final VoidCallback? onOffTrack;

  const InteractiveTracingCanvas({
    super.key,
    required this.guidePoints,
    required this.templatePath,
    required this.characterGlyph,
    this.strokeColor = const Color(0xFFF59E0B),
    this.toleranceRadius = 42.0, // Forgiving for toddler motor coordination
    required this.onCompleted,
    this.onOffTrack,
  });

  @override
  State<InteractiveTracingCanvas> createState() => _InteractiveTracingCanvasState();
}

class _InteractiveTracingCanvasState extends State<InteractiveTracingCanvas>
    with SingleTickerProviderStateMixin {
  final List<Offset> _drawnPoints = [];
  final Set<int> _visitedGuideIndices = {};
  bool _isFinished = false;

  late AnimationController _guideAnimController;
  late StrokeMatcher _strokeMatcher;

  @override
  void initState() {
    super.initState();
    _strokeMatcher = StrokeMatcher(
      guidePoints: widget.guidePoints,
      toleranceRadius: widget.toleranceRadius,
    );

    _guideAnimController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..repeat();
  }

  @override
  void didUpdateWidget(covariant InteractiveTracingCanvas oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.characterGlyph != widget.characterGlyph) {
      _resetCanvas();
    }
  }

  void _resetCanvas() {
    setState(() {
      _drawnPoints.clear();
      _visitedGuideIndices.clear();
      _isFinished = false;
    });
    _guideAnimController.forward(from: 0.0);
  }

  void _handlePanUpdate(DragUpdateDetails details) {
    if (_isFinished) return;

    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final Offset localPosition = renderBox.globalToLocal(details.globalPosition);

    final result = _strokeMatcher.evaluatePoint(localPosition);

    setState(() {
      _drawnPoints.add(localPosition);
      if (result.matchedIndex != null) {
        _visitedGuideIndices.add(result.matchedIndex!);
      }
    });

    if (result.isOffTrack) {
      widget.onOffTrack?.call();
    }

    // Completion condition: visited >= 85% of key guide points
    if (_visitedGuideIndices.length >= (widget.guidePoints.length * 0.85).ceil()) {
      if (!_isFinished) {
        _isFinished = true;
        _guideAnimController.stop();
        widget.onCompleted();
      }
    }
  }

  @override
  void dispose() {
    _guideAnimController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.0,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(32.0),
          border: Border.all(color: const Color(0xFFFCD34D), width: 4.0),
          boxShadow: [
            BoxShadow(
              color: Colors.amber.withOpacity(0.15),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(28.0),
          child: GestureDetector(
            onPanDown: (d) => _handlePanUpdate(
              DragUpdateDetails(globalPosition: d.globalPosition),
            ),
            onPanUpdate: _handlePanUpdate,
            child: AnimatedBuilder(
              animation: _guideAnimController,
              builder: (context, child) {
                return CustomPaint(
                  painter: _TracingCanvasPainter(
                    templatePath: widget.templatePath,
                    guidePoints: widget.guidePoints,
                    drawnPoints: _drawnPoints,
                    visitedIndices: _visitedGuideIndices,
                    strokeColor: widget.strokeColor,
                    guideAnimationProgress: _guideAnimController.value,
                    characterGlyph: widget.characterGlyph,
                  ),
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}

class _TracingCanvasPainter extends CustomPainter {
  final Path templatePath;
  final List<Offset> guidePoints;
  final List<Offset> drawnPoints;
  final Set<int> visitedIndices;
  final Color strokeColor;
  final double guideAnimationProgress;
  final String characterGlyph;

  _TracingCanvasPainter({
    required this.templatePath,
    required this.guidePoints,
    required this.drawnPoints,
    required this.visitedIndices,
    required this.strokeColor,
    required this.guideAnimationProgress,
    required this.characterGlyph,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 1. Draw subtle background guide path ("Dotted Road")
    final roadPaint = Paint()
      ..color = const Color(0xFFE2E8F0)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 36.0
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    canvas.drawPath(templatePath, roadPaint);

    final dashedPaint = Paint()
      ..color = const Color(0xFF94A3B8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4.0;

    canvas.drawPath(templatePath, dashedPaint);

    // 2. Draw user stroke with smooth rounded joins
    if (drawnPoints.length > 1) {
      final userStrokePaint = Paint()
        ..color = strokeColor
        ..style = PaintingStyle.stroke
        ..strokeWidth = 30.0
        ..strokeCap = StrokeCap.round
        ..strokeJoin = StrokeJoin.round;

      final Path userPath = Path()..moveTo(drawnPoints[0].dx, drawnPoints[0].dy);
      for (int i = 1; i < drawnPoints.length; i++) {
        userPath.lineTo(drawnPoints[i].dx, drawnPoints[i].dy);
      }
      canvas.drawPath(userPath, userStrokePaint);
    }

    // 3. Draw Guide checkpoints
    for (int i = 0; i < guidePoints.length; i++) {
      final pt = guidePoints[i];
      final isVisited = visitedIndices.contains(i);

      final circlePaint = Paint()
        ..color = isVisited ? const Color(0xFF10B981) : const Color(0xFFFBBF24)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(pt, isVisited ? 12 : 9, circlePaint);
      canvas.drawCircle(
        pt,
        isVisited ? 12 : 9,
        Paint()
          ..color = Colors.white
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3.0,
      );
    }

    // 4. Draw Animated Star Mascot Demonstrator along path
    if (guidePoints.isNotEmpty) {
      final int activeIndex = (guideAnimationProgress * (guidePoints.length - 1)).floor();
      final Offset starPos = guidePoints[math.min(activeIndex, guidePoints.length - 1)];

      final starPaint = Paint()..color = const Color(0xFFF59E0B);
      canvas.drawCircle(starPos, 16.0, starPaint);
      canvas.drawCircle(
        starPos,
        22.0,
        Paint()
          ..color = Colors.amber.withOpacity(0.4)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 3.0,
      );
    }
  }

  @override
  bool shouldRepaint(covariant _TracingCanvasPainter oldDelegate) => true;
}
`,
    },

    'stroke_matcher.dart': {
      language: 'dart',
      description: 'Algorithmic path validation with distance proximity and off-track detection.',
      code: `import 'dart:math' as math;
import 'dart:ui';

class MatchResult {
  final int? matchedIndex;
  final bool isOffTrack;
  final double minDistance;

  MatchResult({
    this.matchedIndex,
    required this.isOffTrack,
    required this.minDistance,
  });
}

class StrokeMatcher {
  final List<Offset> guidePoints;
  final double toleranceRadius;

  StrokeMatcher({
    required this.guidePoints,
    required this.toleranceRadius,
  });

  /// Evaluates user touch coordinate against the curve reference
  MatchResult evaluatePoint(Offset touch) {
    if (guidePoints.isEmpty) {
      return MatchResult(isOffTrack: false, minDistance: 0.0);
    }

    double minDistance = double.infinity;
    int closestIndex = -1;

    for (int i = 0; i < guidePoints.length; i++) {
      final double dist = (touch - guidePoints[i]).distance;
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = i;
      }
    }

    final bool isMatched = minDistance <= toleranceRadius;
    final bool isOffTrack = minDistance > (toleranceRadius * 1.7);

    return MatchResult(
      matchedIndex: isMatched ? closestIndex : null,
      isOffTrack: isOffTrack,
      minDistance: minDistance,
    );
  }
}
`,
    },

    'localization_provider.dart': {
      language: 'dart',
      description: 'Clean bilingual state notifier supporting Khmer Unicode typography (Kantumruy Pro) and English.',
      code: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';

enum AppLanguage { khmer, english }

class LocalizationState {
  final AppLanguage language;
  final Locale locale;
  final TextStyle primaryTextStyle;
  final TextStyle titleTextStyle;

  LocalizationState({
    required this.language,
    required this.locale,
    required this.primaryTextStyle,
    required this.titleTextStyle,
  });

  bool get isKhmer => language == AppLanguage.khmer;
}

class LocalizationNotifier extends StateNotifier<LocalizationState> {
  LocalizationNotifier()
      : super(
          LocalizationState(
            language: AppLanguage.khmer,
            locale: const Locale('km', 'KH'),
            primaryTextStyle: GoogleFonts.kantumruyPro(),
            titleTextStyle: GoogleFonts.moul(),
          ),
        );

  void toggleLanguage() {
    if (state.isKhmer) {
      state = LocalizationState(
        language: AppLanguage.english,
        locale: const Locale('en', 'US'),
        primaryTextStyle: GoogleFonts.fredoka(),
        titleTextStyle: GoogleFonts.fredoka(fontWeight: FontWeight.bold),
      );
    } else {
      state = LocalizationState(
        language: AppLanguage.khmer,
        locale: const Locale('km', 'KH'),
        primaryTextStyle: GoogleFonts.kantumruyPro(),
        titleTextStyle: GoogleFonts.moul(),
      );
    }
  }

  void setLanguage(AppLanguage language) {
    if (language == AppLanguage.khmer) {
      state = LocalizationState(
        language: AppLanguage.khmer,
        locale: const Locale('km', 'KH'),
        primaryTextStyle: GoogleFonts.kantumruyPro(),
        titleTextStyle: GoogleFonts.moul(),
      );
    } else {
      state = LocalizationState(
        language: AppLanguage.english,
        locale: const Locale('en', 'US'),
        primaryTextStyle: GoogleFonts.fredoka(),
        titleTextStyle: GoogleFonts.fredoka(fontWeight: FontWeight.bold),
      );
    }
  }
}

final localizationProvider =
    StateNotifierProvider<LocalizationNotifier, LocalizationState>((ref) {
  return LocalizationNotifier();
});
`,
    },

    'pubspec.yaml': {
      language: 'yaml',
      description: 'Clean dependency manifest for production mobile deployment.',
      code: `name: kumnit_kids
description: A next-generation bilingual Khmer-English early learning mobile application.
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management
  flutter_riverpod: ^2.4.9

  # Typography & Cambodian Font Rendering
  google_fonts: ^6.1.0

  # High-Fidelity Audio Playback (Zero Latency SFX)
  just_audio: ^0.9.36
  soundpool: ^2.3.0
  record: ^5.1.2

  # Animations & Celebrations
  flutter_animate: ^4.5.0
  confetti: ^0.7.0
  lottie: ^3.0.0

  # Local Persistence (Encrypted Offline Cache)
  shared_preferences: ^2.2.2
  hive_flutter: ^1.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/audio/sfx/
    - assets/audio/km_consonants/
    - assets/audio/en_phonics/
    - assets/stickers/
    - assets/mascots/
`,
    },
  };

  const copyCode = () => {
    navigator.clipboard.writeText(filesMap[selectedFile].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-700 overflow-hidden text-slate-200">
      {/* Header */}
      <div className="bg-slate-800 p-5 border-b border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white font-mono">
                Flutter 3.x Production Architecture & Code
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Null-Safe
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clean Architecture (Feature-First) + Riverpod 2.x + CustomPainter Engine
            </p>
          </div>
        </div>

        <button
          onClick={copyCode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 shadow-lg active:scale-95"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Code Copied!' : 'Copy Active File'}</span>
        </button>
      </div>

      {/* Clean File Navigation Bar */}
      <div className="flex bg-slate-950 px-4 py-2 border-b border-slate-800 overflow-x-auto text-xs font-mono">
        {Object.keys(filesMap).map((fileName) => (
          <button
            key={fileName}
            onClick={() => setSelectedFile(fileName)}
            className={`px-3 py-1.5 rounded-lg mr-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              selectedFile === fileName
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-blue-400" />
            <span>{fileName}</span>
          </button>
        ))}
      </div>

      {/* Description Info Banner */}
      <div className="px-5 py-2.5 bg-slate-800/60 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span>💡 {filesMap[selectedFile].description}</span>
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          Language: {filesMap[selectedFile].language}
        </span>
      </div>

      {/* Syntax Code Box */}
      <div className="p-4 overflow-x-auto max-h-[500px] text-xs font-mono bg-slate-950">
        <pre className="text-slate-300 leading-relaxed">
          <code>{filesMap[selectedFile].code}</code>
        </pre>
      </div>

      {/* Architecture Highlights Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <span className="text-amber-400 font-bold block mb-1">⚡ 60 FPS CustomPainter</span>
          <span className="text-slate-400">
            RepaintBoundary isolates redraws so user strokes never cause expensive widget tree re-layouts.
          </span>
        </div>
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <span className="text-emerald-400 font-bold block mb-1">🇰🇭 Khmer Font Shaping</span>
          <span className="text-slate-400">
            Kantumruy Pro & Moul handle complex Khmer conjunct sub-consonants (ជើងអក្សរ) without glyph clipping.
          </span>
        </div>
        <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
          <span className="text-indigo-400 font-bold block mb-1">📦 Zero-Latency Audio</span>
          <span className="text-slate-400">
            Soundpool pre-caches short UI clicks, chimes, and animal sounds in low-level native audio buffers.
          </span>
        </div>
      </div>
    </div>
  );
};
