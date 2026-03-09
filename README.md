# 🏠 Roomify — AI Architectural Visualization

Transforms flat 2D floor plans into photorealistic 3D renders using AI.
Built with React + Vite + Puter.js (zero API keys, zero credit card).

## Stack
- **React 18** + **TypeScript**
- **Vite** — build tool
- **React Router v6** — routing
- **Tailwind CSS** — styling
- **Puter.js** — auth, AI (Gemini), file hosting, KV database
- **React Compare Slider** — before/after comparison

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Run development server
```bash
npm run dev
```
Open http://localhost:5173

### 3. Create a Puter account
Go to https://puter.com and create a free account (no credit card needed).

### 4. Deploy (optional)
```bash
npm run build
```
Upload the `dist/` folder to Puter App Center, Vercel, or any static host.

## Project Structure
```
src/
├── components/
│   ├── ui/Button.tsx       # Reusable button component
│   ├── Navbar.tsx          # Navigation with auth
│   └── Upload.tsx          # Drag & drop uploader
├── context/
│   └── AuthContext.ts      # Auth React context
├── lib/
│   ├── ai.action.ts        # AI generation (Gemini via Puter)
│   ├── constants.ts        # App constants & AI prompt
│   ├── puter.action.ts     # Auth + project CRUD actions
│   ├── puter.hosting.ts    # Image hosting on Puter FS
│   └── utils.ts            # Utilities
├── routes/
│   ├── Home.tsx            # Homepage with upload + gallery
│   └── Visualizer.tsx      # AI render view + comparison
├── App.tsx                 # Root with auth context + routing
├── main.tsx                # Entry point
├── index.css               # Tailwind + custom styles
└── types.d.ts              # TypeScript types
```

## Features
- ✅ Authentication via Puter (no backend needed)
- ✅ Drag & drop image upload with progress bar
- ✅ AI 2D→3D floor plan generation (Gemini)
- ✅ Image hosting on Puter (permanent public URLs)
- ✅ Project persistence via Puter KV database
- ✅ Before/After comparison slider
- ✅ Export rendered image
- ✅ Project gallery
