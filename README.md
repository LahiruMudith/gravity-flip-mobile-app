# Gravity Flip

Gravity Flip is a 2D physics-based arcade mobile game built with React Native and Expo. Flip gravity, avoid obstacles, and climb the global leaderboard. This repository contains the client app (Expo + TypeScript), simple Firebase integration for auth and leaderboard, and game systems built with Matter.js.

---

## Table of contents

- About
- Features
- Tech stack
- Quick start
- Environment variables (.env)
- Accessing env vars in TypeScript
- Firebase config example
- Deprecated symbol guidance
- Contributing
- License

---

## About

This project demonstrates a small, production-oriented mobile game implemented using React Native (Expo) and TypeScript. It includes physics-driven gameplay with collision handling and a Firebase-backed leaderboard.

## Features

- Real-time physics with Matter.js
- Player controls to flip gravity and navigate a scrolling tunnel
- Firebase Authentication (Email and Google Sign-In)
- Firestore leaderboard for high scores
- NativeWind (Tailwind for RN) for styling
- Audio using `expo-av`
- Cross-platform support for iOS and Android via Expo

## Tech stack

- React Native (Expo)
- TypeScript
- Matter.js
- Firebase (Auth + Firestore)
- NativeWind (Tailwind CSS for RN)
- Expo AV for audio

## Quick start

1. Clone the repo:

   git clone https://github.com/LahiruMudith/gravity-flip-mobile-app.git
   cd gravity-flip

2. Install dependencies:

   npm install

3. Copy the example environment file and fill in your Firebase details (see below):

   PowerShell:
   Copy-Item .env.example .env

   macOS / Linux:
   cp .env.example .env

4. Start the dev server:

   npm start

5. Open the project in Expo Go or run on a simulator/emulator.

## Environment variables (.env)

This project expects environment variables for Firebase configuration. For values that must be accessible in the client bundle, Expo requires them to be prefixed with `EXPO_PUBLIC_`.

A `.env.example` with placeholders exists in the project root. Create a `.env` from it and populate values from your Firebase console. Example keys:

- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID

Important: Do NOT commit your real `.env` file. Add `.env` to `.gitignore`.

## Accessing env vars in TypeScript

In most Expo managed projects, values with the `EXPO_PUBLIC_` prefix are injected into the app and available via `process.env`. Example usage in a TypeScript module:

// app/config/firebase.ts
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
} as const;

If you need to expose env values to native code or during build-time (for example in `app.config.js`), use `dotenv` or Expo's config `extra` property. Example `app.config.js` snippet:

import 'dotenv/config';
export default ({ config }) => ({
  ...config,
  extra: {
    firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  },
});

Then access via `expo-constants` or `expo-updates` depending on your SDK.

## Firebase config example (minimal)

This project contains a `services/firebase.ts` (or `app/config/firebase.ts`) which should initialize Firebase using the config above. Example:

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();

Adjust imports based on your Firebase modular SDK usage.

## Deprecated symbol guidance

If you see deprecation warnings (for example `Constants.manifest`), consult the Expo SDK docs for the correct replacement. A few notes:

- `Constants.manifest` is deprecated in some SDK versions. Consider reading `Updates.manifest` or using `Constants.expoConfig` or the `extra` field from your Expo config depending on your SDK and what metadata you need.
- Always read the deprecation warning — it typically lists the recommended replacement and migration steps.

## Contributing

Contributions are welcome. Typical workflow:

1. Fork the repo
2. Create a branch for your feature/fix
3. Open a PR with a short description and testing steps

If you're adding features that require new environment keys, add placeholders to `.env.example`.

## License

This repository does not currently include an explicit license file. Add one (for example `MIT`) if you plan to make the project public and open-source.

---

If you'd like, I can also:

- Add `app/config/firebase.ts` that reads from `process.env` and exports a typed config object.
- Add `.env` to `.gitignore` if it's missing.
- Create a short CONTRIBUTING.md or a license file (MIT) for the repo.

Which of those would you like me to do next?
