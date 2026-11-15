<div align="center">

# 🍳 Fridge to Recipe

### AI-Powered Smart Kitchen Assistant

**Transform whatever is in your fridge into a structured, step-by-step recipe — instantly.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-fridge--to--recepie.onrender.com-orange?style=for-the-badge&logo=render)](https://fridge-to-recepie.onrender.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%2070B-F55036?style=flat-square)](https://groq.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## Overview

**Fridge to Recipe** is a production-ready web application that takes a home cook's random fridge ingredients and transforms them into a beautifully structured, interactive recipe — not just a text response.

The app calls a Groq LLM via a secure backend proxy, validates the AI output with a strict Zod schema, and renders a fully interactive cooking experience: scalable servings, step-by-step timers, ingredient swaps, and an AI refinement loop.

---

## Features

### Core
- **Ingredient Input** — Free-form text, quick-add pantry chips, or one-click demo presets
- **AI Recipe Generation** — Powered by Groq (LLaMA 3 70B) via a secure Node.js proxy
- **Scalable Servings** — Live ingredient quantity scaling (1–24 servings) with culinary fraction formatting (`1½ cups`, `¼ tsp`)
- **Interactive Step Checklist** — Check off steps as you cook with a live progress bar and confetti celebration on completion
- **Built-in Step Timers** — Countdown timers with audio chime alerts (Web Audio API, no external files)
- **Ingredient Substitutions** — Click any ingredient to see smart alternatives; swapping updates instructions in real-time
- **Nutrition Breakdown** — Per-serving macronutrient estimates (calories, protein, carbs, fats, fiber)

### Advanced
- **AI Refinement Loop** — Follow-up prompts to tweak the recipe ("make it spicy", "vegan version", "15-minute version") without regenerating from scratch
- **Kitchen Focus Mode** — Enlarged, high-contrast layout designed for hands-free cooking from across the counter
- **Saved Recipe Book** — LocalStorage persistence with JSON export and one-click loading
- **Dark / Light Mode** — System preference detected automatically
- **Print / PDF Export** — Clean print stylesheet for physical recipe cards

### Developer / Evaluator
- **Bad AI Output Studio** — On-screen panel to trigger and inspect: malformed JSON, schema mismatches, timeouts, server crashes, and race conditions
- **Secure Backend Proxy** — LLM API keys never reach the browser bundle
- **Zero-Config Mode** — Works fully offline with a built-in mock recipe engine when no API key is configured

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State & Hooks | Custom React hooks, `useCallback`, `useRef`, `AbortController` |
| Schema Validation | Zod (server + client dual-layer) |
| AI Provider | Groq — LLaMA 3 70B (`llama3-70b-8192`) |
| Backend | Node.js, Express |
| Deployment | Render (single fullstack service) |
| Storage | Browser `localStorage` |
| Audio | Web Audio API (synthesized chimes, no MP3 assets) |

---

## Project Structure

```
fridge-to-recipe/
├── server/                        # Express backend proxy
│   ├── index.js                   # API server (port 5000 / Render port 10000)
│   ├── schemas/
│   │   └── recipeSchema.js        # Zod schema + sanitizer
│   ├── services/
│   │   ├── llm.js                 # Groq API integration with fallback
│   │   └── mock.js                # Zero-config recipe engine
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── client/                        # React frontend
│   ├── index.html
│   ├── vite.config.js             # Dev proxy → localhost:5000
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── FridgeInput.jsx        # Ingredient input form
│       │   ├── RecipeDisplay.jsx      # Full recipe view
│       │   ├── IngredientList.jsx     # Checkable list + swap popover
│       │   ├── StepChecklist.jsx      # Step-by-step guide + focus mode
│       │   ├── StepTimer.jsx          # Countdown timer component
│       │   ├── NutritionCard.jsx      # Macros display
│       │   ├── RefinementLoop.jsx     # AI follow-up prompt bar
│       │   ├── BadOutputSimulator.jsx # Failure mode test panel
│       │   ├── SavedRecipesModal.jsx  # Recipe book
│       │   ├── SettingsModal.jsx      # API key + provider config
│       │   ├── Navbar.jsx
│       │   ├── ErrorAlert.jsx
│       │   └── ErrorBoundary.jsx
│       ├── hooks/
│       │   ├── useRecipeGenerator.js  # API calls + race condition guard
│       │   ├── useSavedRecipes.js     # localStorage sync
│       │   └── useStepTimer.js        # Web Audio countdown
│       └── utils/
│           ├── unitScaler.js          # Culinary fraction formatter
│           └── recipeValidator.js     # Client-side defensive sanitizer
│
├── package.json                   # npm workspaces root
├── render.yaml                    # Render deployment config
└── .gitignore
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone and install
```bash
git clone https://github.com/agrimagoel30/Fridge-to-recepie.git
cd Fridge-to-recepie
npm install
```

### 2. Add Groq API key (optional)
```bash
# Copy the example file
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

> Get a free key at [console.groq.com](https://console.groq.com). The app works without a key using the built-in recipe engine.

### 3. Run locally
```bash
npm start
```

- Frontend → `http://localhost:3000`
- Backend API → `http://localhost:5000`

---

## Deployment

This app is configured for single-service deployment on Render.

```yaml
Build Command: npm run build:render
Start Command: npm run start:render
```

Add `GROQ_API_KEY` as an environment variable in the Render dashboard.

**Live:** [fridge-to-recepie.onrender.com](https://fridge-to-recepie.onrender.com)

---

## Handling Bad AI Output

A core focus of this project is graceful degradation when the AI behaves unpredictably.

| Failure | Protection |
|---|---|
| Malformed / truncated JSON | Regex extraction + JSON.parse with try/catch |
| Wrong schema (missing fields) | Zod validation with field-level error reporting |
| Stale race conditions | Monotonic `requestIdRef` + `AbortController` cancellation |
| Network timeout | 30-second client guard with abort and retry |
| API server crash | Structured error response + user-facing retry UI |
| Missing API key | Automatic fallback to built-in mock engine |

The **Bad AI Output Studio** in the app navbar lets you trigger any of these scenarios live.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/recipe/generate` | Generate recipe from ingredients |
| `POST` | `/api/recipe/refine` | Refine existing recipe with follow-up prompt |
| `POST` | `/api/validate` | Validate raw JSON against recipe schema |

---

## License

MIT
