# Cuaderno 70

An installable training and nutrition log for a lean bulk from 62 to 70 kg. Log your morning weight, follow a Push / Pull / Legs / Arms split with automatic progression hints, estimate meals from a photo or a plain description instead of weighing food, and get a weekly AI review of how it is going.

Available in English and Spanish. Works offline and installs to the home screen on Android and iOS.

**Live demo:** https://flaviofersu-pixel.github.io/cuaderno-70/

<p>
  <img src="docs/today.png" width="260" alt="Today screen with calories and protein left and a meal composer" />
  <img src="docs/training.png" width="260" alt="Training screen with last session and progression hint per exercise" />
  <img src="docs/weight.png" width="260" alt="Weight screen with a 7-day average trend chart" />
</p>

_Screenshots use sample data._

## Features

- **Daily budget.** Calories and protein left for the day, against targets you can change.
- **Meals without a scale.** Describe a meal ("a plate of pasta with 2 cans of tuna and some oil"), add a photo, or both. Claude estimates calories and macros per ingredient, says how confident it is, and you confirm or edit before saving. Quick-add buttons cover the plan's staple meals.
- **"What should I eat?"** Three concrete options that close the remaining calories and protein using what's in the pantry.
- **Weight trend.** Daily weigh-ins, a 7-day rolling average and a pace check against the +0.2 to +0.3 kg per week target.
- **Double progression.** Each exercise shows last session's sets and tells you whether to add a rep or move up in weight (2.5 kg on compound lifts, 1 kg on isolation work). Unfinished sessions survive closing the app.
- **Weekly check-in and AI review.** The plan's weekly checklist is computed from your logs, and Claude writes a short review with concrete adjustments. Reviews are kept so you can compare weeks.
- **Backup.** Export and restore all logs as JSON. The API key is never included.

## Tech stack

| Area    | Choice                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------- |
| UI      | React 19, TypeScript (strict), plain CSS with design tokens and light/dark themes                                 |
| Build   | Vite, `vite-plugin-pwa` (Workbox service worker, web app manifest)                                                |
| Storage | IndexedDB through Dexie, with live queries driving the UI                                                         |
| AI      | Anthropic TypeScript SDK, structured outputs validated with Zod, streaming for long answers                       |
| Quality | ESLint (`typescript-eslint` strict type-checked, React Hooks), Prettier, Vitest                                   |
| CI/CD   | GitHub Actions: type check, lint, format check, tests and build on every push; deploy to GitHub Pages from `main` |

## Architecture

```
src/
├── data/        Training plan, exercises, meal presets and default targets
├── domain/      Pure logic: dates, weight trend, progression, nutrition, weekly check-in (unit tested)
├── db/          Dexie schema, data-layer helpers and JSON backup
├── services/
│   ├── ai/      Anthropic client, Zod schemas and typed errors, lazy-loaded on first use
│   └── prompts.ts
├── i18n/        English and Spanish messages with a shared, type-checked shape
├── features/    One folder per tab: today, weight, training, progress
├── components/  Small shared UI pieces
└── hooks/       Live data hooks
```

A few decisions worth calling out:

- **Logic is separate from UI.** Everything that decides something (pace, when to add weight, the weekly checklist) lives in `src/domain` as pure functions with tests. Components only render and handle input.
- **No backend.** Data stays on the device in IndexedDB. The AI features call the Anthropic API directly from the browser with a key the user provides, stored only on their device. This keeps the app free to host on GitHub Pages; the trade-off is that it suits a personal tool rather than a multi-user product.
- **The AI code is loaded on demand.** The SDK and Zod are split into a separate chunk that only downloads when an AI feature is first used.
- **Structured outputs.** Meal estimates and suggestions are requested as JSON matching a Zod schema, so the UI never parses free text. Model output rendered as Markdown is turned into React elements, never injected as HTML.
- **Translations are typed.** The Spanish messages must match the English shape at compile time, and a test checks that no key is missing or empty. The AI answers in the selected language.
- **Stable IDs over display names.** Workouts store exercise IDs, so switching language never breaks history or progression.

## Getting started

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Open the app, go to **Progress → Settings** and paste an Anthropic API key from [platform.claude.com](https://platform.claude.com/settings/keys) to enable the AI features. Everything else works without one.

### Scripts

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                      |
| `npm run build`   | Type check and build for production                       |
| `npm run preview` | Serve the production build locally                        |
| `npm test`        | Run the unit tests once                                   |
| `npm run lint`    | Run ESLint                                                |
| `npm run format`  | Format with Prettier                                      |
| `npm run check`   | Type check, lint, format check and tests, as CI runs them |

## Installing on a phone

Open the live demo in the phone's browser, then:

- **Android (Chrome):** menu → **Install app**.
- **iPhone (Safari):** Share → **Add to Home Screen**.

## License

[MIT](LICENSE)
