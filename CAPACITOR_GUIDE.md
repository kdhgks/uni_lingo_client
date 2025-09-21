# UniLingo - Capacitor 모바일 앱 가이드

이 가이드는 UniLingo 웹앱을 Capacitor를 사용하여 Android 및 iOS 모바일 앱으로 변환하는 방법을 설명합니다.

## 📱 설치된 Capacitor 플러그인

- **@capacitor/app**: 앱 생명주기 관리
- **@capacitor/haptics**: 햅틱 피드백
- **@capacitor/keyboard**: 키보드 관리
- **@capacitor/status-bar**: 상태바 관리
- **@capacitor/splash-screen**: 스플래시 스크린

## 🚀 앱 빌드 및 실행

### 1. 웹앱 빌드 및 동기화

```bash
npm run cap:build
```

이 명령어는 웹앱을 빌드하고 Capacitor에 동기화합니다.

### 2. Android 앱 실행

```bash
npm run cap:android
```

이 명령어는 Android Studio를 열고 앱을 실행할 수 있게 합니다.

### 3. iOS 앱 실행 (macOS만)

```bash
npm run cap:ios
```

이 명령어는 Xcode를 열고 앱을 실행할 수 있게 합니다.

### 4. 수동 동기화

```bash
npm run cap:sync
```

웹앱 변경사항을 네이티브 앱에 동기화합니다.

## 📂 프로젝트 구조

```
uni_lingo_client/
├── android/                 # Android 네이티브 프로젝트
├── ios/                     # iOS 네이티브 프로젝트
├── build/                   # 빌드된 웹앱 파일
├── capacitor.config.ts      # Capacitor 설정 파일
└── src/                     # React 소스 코드
```

## ⚙️ Capacitor 설정

`capacitor.config.ts` 파일에서 다음 설정이 구성되어 있습니다:

- **앱 ID**: `com.unilingo.app`
- **앱 이름**: `UniLingo`
- **웹 디렉토리**: `build`
- **스플래시 스크린**: 3초간 표시
- **상태바**: 기본 스타일
- **키보드**: 바디 리사이즈

## 🔧 개발 워크플로우

1. **웹앱 개발**: React 코드를 수정합니다.
2. **빌드**: `npm run cap:build`로 빌드하고 동기화합니다.
3. **테스트**: Android Studio 또는 Xcode에서 앱을 실행합니다.
4. **반복**: 필요에 따라 위 과정을 반복합니다.

## 📱 플랫폼별 요구사항

### Android

- Android Studio
- Android SDK
- Java Development Kit (JDK)

### iOS (macOS만)

- Xcode
- iOS SDK
- CocoaPods (자동 설치됨)

## 🎨 앱 아이콘 및 스플래시 스크린

현재 기본 Capacitor 설정을 사용하고 있습니다. 커스텀 아이콘과 스플래시 스크린을 추가하려면:

1. **Android**: `android/app/src/main/res/` 디렉토리에 아이콘 파일 추가
2. **iOS**: `ios/App/App/Assets.xcassets/` 디렉토리에 아이콘 파일 추가

## 🔍 디버깅

### 웹 개발 서버 실행

```bash
npm start
```

### 네이티브 앱에서 웹 개발 서버 사용

1. `npm start`로 개발 서버 실행
2. `capacitor.config.ts`에서 `server.url` 설정
3. `npm run cap:sync`로 동기화

## 📦 배포

### Android APK 빌드

1. Android Studio에서 프로젝트 열기
2. Build → Generate Signed Bundle/APK 선택
3. APK 또는 AAB 파일 생성

### iOS 앱 배포

1. Xcode에서 프로젝트 열기
2. Archive 생성
3. App Store Connect에 업로드

## 🆘 문제 해결

### 일반적인 문제들

1. **플러그인이 작동하지 않음**: `npm run cap:sync` 실행
2. **빌드 오류**: `node_modules` 삭제 후 `npm install` 재실행
3. **Android Studio 오류**: Android SDK 업데이트 확인
4. **iOS 빌드 오류**: Xcode 및 CocoaPods 업데이트 확인

### 로그 확인

```bash
npx cap run android --livereload --external
npx cap run ios --livereload --external
```

## 📚 추가 리소스

- [Capacitor 공식 문서](https://capacitorjs.com/docs)
- [Ionic Framework](https://ionicframework.com/)
- [Capacitor 플러그인](https://capacitorjs.com/docs/plugins)

## 🎯 다음 단계

1. 커스텀 앱 아이콘 및 스플래시 스크린 추가
2. 푸시 알림 설정
3. 앱 스토어 등록
4. 성능 최적화
5. 추가 네이티브 기능 통합


