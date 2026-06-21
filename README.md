<div align="center">

# 🛡️ DeepShield AI

### India's First AI-Powered Digital Asset Protection Platform

**Protecting 1.4 Billion Indians from Deepfakes, Document Fraud & Digital Scams**

[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash-1A73E8?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![CI Status](https://img.shields.io/github/actions/workflow/status/jaisogani-ai/DeepShield-AI/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/jaisogani-ai/DeepShield-AI/actions)

---

### 🌐 [Live Demo](https://deepshield-ai.web.app) 
**Built by Team Easycoder &nbsp;|&nbsp; Category: Digital Asset Protection**

</div>

---

## 🔧 v0.2 Upgrade Notes

This pass focused on **security, architecture, and three new features** requested for the project:

**Security**
- 🔐 **Gemini API key moved server-side.** The original build called `@google/genai` directly from the browser, which baked `GEMINI_API_KEY` into the public JS bundle — anyone could open devtools and steal it. All AI calls now go through a small Express API (`server/index.ts`); the key never reaches the client. Verified by grepping the production bundle for the key/SDK after `npm run build` — zero occurrences.

**Architecture**
- 🧩 Split the single 1,686-line `src/App.tsx` into `~20` focused files under `src/components/`, `src/contexts/`, `src/lib/`, and `src/i18n/`.
- ☁️ **Firebase is now actually wired up** (it was referenced in this README and in `firestore.rules`/`firebase-blueprint`, but no `firebase.ts` existed and history was localStorage-only). `src/lib/firebase.ts` adds anonymous auth + live Firestore sync, with an automatic fallback to localStorage if no Firebase project is configured — so the app still works out of the box with zero setup.
- 🐛 Fixed a dashboard bug where the "Deepfakes" and "Scam Messages" breakdown bars always read 0 (they were comparing against type strings that didn't match what scans were actually tagged with).

**New features**
- 🎙️ **Voice Clone Detector** — a dedicated audio-only analyzer (separate nav item + Gemini prompt) checking for synthesis artifacts, prosody anomalies, and spectral inconsistencies, distinct from the general media scanner.
- 🎯 **Trust Score (0–100)** — a radial gauge next to every verdict, oriented so 100 = fully trustworthy and 0 = fully malicious, plus a LOW/MEDIUM/HIGH confidence band.
- 🔍 **Explainability layer** — red flags are now structured, categorized (visual/audio/text/metadata/network), severity-ranked evidence instead of a flat bullet list.

See `server/index.ts`, `src/lib/api.ts`, and `src/lib/firebase.ts` for the implementation, and the updated **Getting Started** section below for the new (still simple) dev workflow.

---

## 📌 About The Project

**DeepShield AI** is India's first AI-powered platform that protects citizens from the fastest-growing digital threats — deepfakes, voice clones, document forgery, scam messages, and phishing links — all powered by **Google Gemini**.

### 🚨 The Problem

India recorded **13.2 lakh cybercrime cases** in 2024, with losses exceeding **₹11,333 crore**:

- 🎭 Deepfake videos/audio used to impersonate family members and scam elderly Indians
- 📄 Fake Aadhaar, PAN cards and certificates used for identity theft
- 💬 WhatsApp/SMS scam messages in Hindi bypass English-only detection tools
- 🔗 Phishing links disguised as SBI, HDFC, government portals steal crores daily
- 😰 Common citizens have **no easy tool** to verify suspicious digital content

### ✅ Our Solution

DeepShield AI provides **5 powerful AI shields** + **Live India Threat Map** + **Hindi/English Support**

---

## ✨ Features

### 🎭 1. Deepfake & Synthetic Media Detector
- Upload any **image or video** file
- Google Gemini analyzes pixel artifacts, facial anomalies & lighting inconsistencies
- Returns **REAL ✅ or FAKE ❌** verdict with confidence %, plus a 0-100 **Trust Score**
- Structured, categorized evidence (not just a flat list) explains exactly what was found and where
- Explanation in both **Hindi and English**

### 🎙️ 2. Voice Clone Detector
- Upload an **audio clip** (calls, voice notes, voicemails)
- Dedicated Gemini prompt checks for synthesis artifacts, unnatural prosody, spectral inconsistencies, and speaker-embedding anomalies — distinct from the general media scanner above
- Returns **REAL ✅ or CLONED ❌** verdict with the same Trust Score + evidence breakdown

### 📄 3. Document Authenticity Scanner
- Photograph any **Aadhaar, PAN, passport, or certificate**
- AI checks font consistency, logo authenticity, QR validity, layout standards
- Returns **GENUINE or SUSPICIOUS** verdict
- Generates unique **DSA-2026-IND verification certificate** for genuine documents
- Permanently verifiable via Firebase database

### 💬 4. Scam Message Analyzer
- Paste any suspicious **SMS, WhatsApp, or email message**
- Detects UPI fraud, fake KYC requests, electricity bill scams, loan harassment
- Works in **Hindi and English** — covers all major Indian scam patterns
- One-click report generation for **cybercrime.gov.in**

### 🔗 5. URL Safety Checker
- Paste any suspicious link before clicking
- Detects **phishing sites, fake SBI/HDFC pages, government impersonation**
- Catches typo-squatting (`g00gle.com`, `paypal-security.net`)
- Returns **SAFE ✅ or DANGEROUS ❌** verdict instantly

### 🗺️ 6. Live India Threat Map
- Real-time SVG map showing threat levels across **15+ Indian cities**
- Pulsing red/orange/yellow animated dots per threat level
- Hover any city to see active threats, scam types, and last scan time
- Live scrolling ticker showing latest threats detected nationwide

### 🇮🇳 7. Hindi / English Toggle
- Full bilingual support — one click switches entire UI to Hindi
- Reaches non-English speaking Indians who need protection most

### 📜 8. Safety Certificates
- Genuine detections generate **downloadable HTML certificate**
- Unique `DSA-2026-IND-XXXXXX` verification ID
- Permanently stored in Firebase — anyone can verify authenticity

### 🚔 9. One-Click Cybercrime Reporting
- Fake/dangerous detections auto-generate a complete report
- One click opens **cybercrime.gov.in**
- Helpline **1930** prominently displayed

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **AI Engine** | Google Gemini 2.5 Flash | Multimodal deepfake, voice-clone, document & scam analysis |
| **API Server** | Express (Node.js) + tsx | Proxies all Gemini calls server-side — the API key never reaches the browser |
| **Frontend** | React 19 + TypeScript | UI components and state management |
| **Build Tool** | Vite | Fast development and production builds, dev-proxies `/api` to the Express server |
| **Styling** | Tailwind CSS | Dark cybersecurity themed UI |
| **Database** | Firebase Firestore *(optional)* | Real-time, cross-device scan history when configured; falls back to localStorage otherwise |
| **Auth** | Firebase Anonymous Auth *(optional)* | Scopes cloud history to a device/user without requiring sign-up |
| **Maps** | react-simple-maps + TopoJSON | India threat visualization |
| **Dev Platform** | Google AI Studio | Originally built and tested in AI Studio |

---

## 📂 Project Structure

```
DeepShield-AI/
├── server/
│   └── index.ts               # Express API — the only place GEMINI_API_KEY is read
├── public/
│   └── india-topo.json        # India map TopoJSON data
├── src/
│   ├── App.tsx                 # Slim orchestrator: routing, auth, history sync
│   ├── types.ts                 # Shared ScanResult / EvidenceItem / Page types
│   ├── i18n/
│   │   └── translations.ts      # Hindi/English strings
│   ├── contexts/
│   │   ├── LangContext.tsx
│   │   └── SoundContext.tsx
│   ├── lib/
│   │   ├── api.ts               # fetch() wrappers calling the Express API
│   │   ├── firebase.ts          # Optional Firebase Auth + Firestore sync
│   │   └── utils.ts             # fileToBase64, timeAgo, certificate ID generator
│   ├── components/
│   │   ├── Navbar.tsx, Footer.tsx, Hero.tsx
│   │   ├── FileScanner.tsx       # Shared upload+analyze UI (media/document/voice)
│   │   ├── DeepfakeScanner.tsx, VoiceCloneChecker.tsx, DocumentVerifier.tsx
│   │   ├── ScamChecker.tsx, UrlChecker.tsx
│   │   ├── AnalysisResultCard.tsx, TrustScoreGauge.tsx, ExplainabilityPanel.tsx
│   │   ├── CybercrimeAction.tsx, CertificateAction.tsx
│   │   ├── Dashboard.tsx, ThreatTypeBreakdown.tsx, LiveScanFeed.tsx, AnimatedCounter.tsx
│   │   ├── IndiaThreatMap.tsx, ScanningAnimation.tsx
│   ├── index.css                # Global styles + Tailwind directives
│   └── main.tsx                 # App entry point
├── firestore.rules             # Firebase security rules (optional cloud sync)
├── firebase-blueprint.json      # Firestore schema definitions
├── .env.example                 # Environment variable template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ (v22 recommended)
- A free [Google AI Studio](https://aistudio.google.com/apikey) API key
- *(Optional)* A [Firebase](https://console.firebase.google.com) project, only if you want cross-device cloud history instead of the localStorage default

### 1. Clone the Repository

```bash
git clone https://github.com/jaisogani-ai/DeepShield-AI.git
cd DeepShield-AI
```

### 2. Install Dependencies

```bash
npm install
```
> Note: `react-simple-maps` only declares React 16–18 as a peer dependency, so on React 19 you'll need `npm install --legacy-peer-deps`.

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and at minimum set your Gemini key (server-side only — never exposed to the browser):

```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=8787
```

Firebase variables are optional — leave them blank to use localStorage-only history with zero extra setup.

### 4. Run Locally

This app now has two processes: the Vite dev server (frontend) and the Express API (backend, holds the Gemini key). Run both together:

```bash
npm run dev:all
```

Open `http://localhost:3000` in your browser. (`npm run dev` and `npm run dev:server` also work individually if you want separate terminals/logs.)

### 5. Build for Production

```bash
npm run build
```

This builds the static frontend to `dist/`. The Express API in `server/index.ts` needs to be deployed and running separately (e.g. as its own Cloud Run / Node service) — point the frontend at it via `VITE_API_BASE_URL` in `.env` if it's not on the same origin.

### 6. Deploy

The frontend (static `dist/`) and the API server (`server/index.ts`) are deployed separately:

```bash
# Frontend → Firebase Hosting (or any static host)
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy

# Backend → anywhere that runs Node (Cloud Run, Render, Railway, a VM...)
# Just needs: GEMINI_API_KEY set, and `npx tsx server/index.ts` (or compile + `node`) as the start command.
```

Set `VITE_API_BASE_URL` in your frontend's production env to the deployed backend's URL before building, e.g. `VITE_API_BASE_URL=https://your-api.run.app/api`.

---

## 🔑 How to Get API Keys

### Gemini API Key (Free)
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy and paste into `.env`

### Firebase Config
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project → **"deepshield-ai"**
3. Click Settings gear → **"Project Settings"**
4. Scroll to **"Your Apps"** → Add Web App
5. Copy the config object values into `.env`

---

## 🔐 How Gemini AI Works In This App

All prompts live in `server/index.ts` — the **only** file that ever sees `GEMINI_API_KEY`. Every analyzer shares one evidence schema so the frontend can render the same Trust Score + Explainability UI everywhere:

```typescript
const EVIDENCE_SCHEMA = `"evidence": [
  { "category": "visual|audio|text|metadata|network", "finding": "short specific finding",
    "severity": "low|medium|high", "location": "optional: timestamp, region, or text location" }
]`;

// Deepfake Detection Prompt (image/video)
const prompt = `You are DeepShield AI, India's top deepfake detection system.
Analyze this media file for signs of AI manipulation, deepfake generation, or digital
tampering. Check for: unnatural eye blinking, facial boundary artifacts, lighting
inconsistencies, pixel-level anomalies, unnatural skin texture, audio-visual sync issues.
Return JSON: { verdict: "REAL"|"FAKE", confidence: 0-100,
  threat_level: "SAFE"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL", ${EVIDENCE_SCHEMA},
  explanation_hindi, explanation_english, recommendation }`;

// Voice Clone Detection Prompt (audio only — new)
const prompt = `You are DeepShield AI's voice clone & synthetic audio detector.
Check for: speaker embedding anomalies, unnatural prosody/rhythm, synthesis/vocoder
artifacts, spectral inconsistencies, unnatural breathing patterns.
Return JSON: { verdict: "REAL"|"CLONED", ...same shape as above }`;

// Document Verification Prompt
const prompt = `You are DeepShield AI document verification system.
Check: font consistency, logo authenticity, QR code validity, color gradients,
hologram indicators, layout standards, government watermarks.
Return JSON: { verdict: "GENUINE"|"SUSPICIOUS", ...same shape as above }`;

// Scam Detection Prompt
const prompt = `You are DeepShield AI scam detection system for Indian users.
Check for: urgency manipulation, fake government impersonation, UPI fraud patterns,
KYC scam language, lottery/job/loan/romance fraud.
Return JSON: { verdict: "REAL"|"FAKE", scam_type, ...same shape as above }`;

// URL Safety Prompt
const prompt = `You are DeepShield AI URL safety analyzer for Indian users.
Check for: fake banking sites, UPI fraud pages, government impersonation,
brand misspelling, suspicious TLDs.
Return JSON: { verdict: "SAFE"|"DANGEROUS", impersonating, ...same shape as above }`;
```

The server then computes `trust_score` (0-100, oriented so higher = safer) and `confidence_band` from the verdict + confidence — it doesn't ask the model to self-report these, since deriving them deterministically is more reliable than relying on the LLM to keep two correlated numbers consistent.

---

## 🗺️ Firestore Data Schema

```javascript
// Collection: scans  (only written when Firebase env vars are configured;
// see src/lib/firebase.ts. Without them, history stays in localStorage instead.)
{
  id: "k3j2h9f",                          // Short random scan ID
  userId: "firebase_auth_uid",            // Anonymous auth UID
  type: "Media File" | "Voice Clone" | "Document" | "Text/Message" | "URL",
  date: "2026-06-21T10:15:00.000Z",       // ISO timestamp
  verdict: "REAL" | "FAKE" | "GENUINE" | "SUSPICIOUS" | "SAFE" | "DANGEROUS" | "CLONED",
  confidence: 94.7,                       // Model's confidence in the verdict, 0-100
  trust_score: 5,                         // 0-100, 100 = fully trustworthy/safe
  confidence_band: "HIGH" | "MEDIUM" | "LOW",
  threat_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  red_flags: ["Unnatural eye movement", "Pixel artifacts detected"],
  evidence: [                             // Structured explainability layer
    { category: "visual", finding: "Unnatural eye movement", severity: "high", location: "0:04" }
  ],
  explanation_english: "...",
  explanation_hindi: "...",               // optional
  recommendation: "...",
  scam_type: "UPI Fraud",                 // optional, scam scans only
  impersonating: "State Bank of India"    // optional, URL scans only
}
```

---

## 🔒 Security & Privacy

- **Gemini API key is server-only** — read exclusively by `server/index.ts`; it is never bundled into the frontend JS (verified by inspecting `dist/` after build)
- **No permanent media storage** — uploaded files are sent to the API as base64 in-memory and never written to disk or Firestore
- **RBAC with Firebase Rules** — users can only read/write/delete their own scan records, and every field is type/range/enum-validated server-side before a write is accepted
- **Anonymous scanning supported** — no account required; an anonymous Firebase Auth UID scopes cloud history per device when Firebase is configured
- **Optional cloud sync** — with no Firebase project configured, history simply stays in `localStorage` on-device; no data leaves the browser except the scan content itself (sent to the API for analysis)

```javascript
// firestore.rules (abridged — see the full file for field-level validation)
match /scans/{scanId} {
  allow read, list: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && isValidScanResult(request.resource.data);
  allow update: if false;
  allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
}
```

---

## 📊 Platform Capabilities

| Metric / Capability | Details |
|--------|-------|
| **Target Audience** | Internet users and organizations in India |
| **Multilingual Support** | English + Hindi translation support |
| **Threat Map Coverage** | 15+ monitored locations (simulation) |
| **Avg. Scan Response Time** | ~2–3 seconds (powered by Gemini) |
| **Verification Schema** | Fully compliant with Firestore blueprint schemas |
| **Fallback Strategy** | LocalStorage fallback with no setup required |

---

## 🧪 Testing

DeepShield AI includes unit and integration tests covering utilities, types, and server validation schemas using Vitest.

### Run Tests

To execute the test suite:
```bash
npm test
```

### Run Tests with Coverage

To generate coverage reports:
```bash
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**🛡️ Driven by AI. Built with ❤️ by Team Easycoder.**

**Google Build with AI 2026 &nbsp;|&nbsp; Digital Asset Protection**

[![Powered by Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini_2.5_Flash-1A73E8?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Hosted_on-Firebase_Google_Cloud-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

</div>
