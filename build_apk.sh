#!/usr/bin/env bash
# ==============================================================================
# Kumnit Kids — Flutter Android APK Build Script
# ==============================================================================
set -e

echo "🚀 [1/4] Checking Flutter environment..."
flutter --version

echo "📦 [2/4] Resolving dependencies in pubspec.yaml..."
flutter pub get

echo "🔨 [3/4] Building optimized Android Release APKs..."
flutter build apk --release --split-per-abi
flutter build apk --release

echo "✅ [4/4] APK Build Complete! Generated APK files:"
ls -lh build/app/outputs/flutter-apk/*.apk

echo ""
echo "📱 Universal APK location:"
echo "👉 build/app/outputs/flutter-apk/app-release.apk"
echo ""
echo "To install on your connected Android phone via ADB:"
echo "adb install build/app/outputs/flutter-apk/app-release.apk"
