# FarmBot (ഫാംബോട്ട്) 🌿

AI-powered crop disease diagnosis web app for Kerala farmers.

## Features
- 📷 **AI Vision Diagnosis**: Photograph a diseased crop leaf and get instant analysis.
- 🎙️ **Voice Integration**: Malayalam speech-to-text for natural interaction.
- 🌤️ **Weather-Aware Plans**: Treatment plans calibrated to local weather and forecast.
- 📋 **History**: Track past diagnoses via phone number.
- 📱 **PWA**: Installable on Android/iOS for easy access.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion
- **Database/Storage**: Firebase Firestore & Storage
- **AI**: Gemini 1.5 Pro, Google Speech-to-Text
- **API**: Google Maps (Geocoding & Weather)

## Getting Started

### 1. Prerequisites
- Node.js 18+
- Firebase Project
- Google Cloud Project with Gemini, STT, and Maps enabled

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in the keys:
```bash
cp .env.example .env.local
```

### 3. Installation
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deployment
Deploy to Vercel with a single click. Ensure all environment variables are added to the Vercel dashboard.

## Security
Firestore rules are included in `firestore.rules`. For production, ensure `request.auth` is properly configured for phone authentication.

## License
MIT
