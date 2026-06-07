# StaffFlow HR Mobile — Build Guide

## Prerequisites

1. Install Flutter SDK: https://docs.flutter.dev/get-started/install/windows
2. Install Android Studio + Android SDK (API 34)
3. Set environment variables:
   - `FLUTTER_HOME` = `C:\flutter`
   - Add `%FLUTTER_HOME%\bin` to PATH
4. Run `flutter doctor` — fix all issues

## Quick Start

```bash
cd apps/mobile

# Install dependencies
flutter pub get

# Run on connected device / emulator
flutter run

# Build debug APK (fast, no optimization)
flutter build apk --debug

# Build release APK (optimized, ~15MB)
flutter build apk --release --split-per-abi

# Build split APKs (smaller per architecture)
flutter build apk --split-per-abi

# Build App Bundle (for Play Store)
flutter build appbundle
```

## APK Location after build

```
apps/mobile/build/app/outputs/flutter-apk/
├── app-arm64-v8a-release.apk   ← Modern phones (recommended)
├── app-armeabi-v7a-release.apk ← Older phones
└── app-x86_64-release.apk      ← Emulators
```

## Backend Configuration

Edit `lib/services/api_service.dart`:

```dart
// For Android Emulator (connects to localhost on host machine):
static const String _baseUrl = 'http://10.0.2.2:4000/api/v1';

// For physical device (use your computer's IP):
static const String _baseUrl = 'http://192.168.1.xxx:4000/api/v1';

// For production:
static const String _baseUrl = 'https://api.staffflow.uz/api/v1';
```

## Demo Login

When backend is unavailable, use the "Demo" buttons on the login screen.

## Features

### Employee App
- GPS check-in / check-out with selfie
- Monthly attendance history
- Leave requests (vacation, sick, business trip, remote)
- Payroll history with detailed breakdown
- Task management
- Profile with 8-language support

### Director / HR App  
- Real-time employee monitoring dashboard
- Department-wise attendance breakdown
- Employee list with status filters
- Leave approval workflow
- Push notifications

## Language Support
uz • ru • en • ky • tg • kk • tr • az
(Select in Profile → Settings)
