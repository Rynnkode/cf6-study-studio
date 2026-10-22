# CF6 Study Studio

A personal, mobile-first **unofficial** study web app for the Chartered Insurance Institute's **CF6 Mortgage Advice 2026/27** syllabus. Built in Vite, React, TypeScript, Tailwind CSS, Dexie/IndexedDB and vite-plugin-pwa. **No accounts, API keys, paid service, Firebase or Supabase.**

## What's inside

- 16 outcome modules over a flexible six-week timetable, with original study notes, definitions, client examples, key points and examination pitfalls. Modules link to outcome knowledge checks (at least five original knowledge checks for each outcome).
- 100 **original** section A multiple-choice questions matching the current published distribution of learning outcomes 1–15. 25 additional questions in 5 **fictional** client case studies (outcome 16). **135 total distinct questions** (10 supplementary questions beyond the 125-question exam blueprint). This is an initial, expandable authored bank, not the longer-term 300-question target. The full simulation comprises all 100 section A questions and 5 × 5 linked section B case questions, and has a 3-hour real-time countdown, flags, navigation, saving and scoring.
- Daily 10, quick 10, 25, 50, full 125, difficult, wording traps, topic practice and retry-mistakes modes. Explanations, topic breakdowns and review. A resumed practice test retains answers and deadline even if the app is closed (time continues running for the full mock).
- **132 flashcards**: 32 glossary definition cards plus 100 active-recall questions, with an interval-based Again/Hard/Good/Easy spaced-repetition schedule. This is a simple transparent scheduler, **not** a formally validated memory model.
- Mistakes notebook (mastery requires 3 subsequent correct recalls), charts calculated from saved attempts, readiness estimate withheld until adequate evidence, revision recommendations, calculators, examination date and study statistics.
- Automatic IndexedDB progress storage; versioned local database; manual **JSON export/import**; double-confirmation reset; offline-capable installable PWA. No cross-device sync: move backup files yourself.

## Examination facts verified 22 October 2026

CII exam 2026/27: **100 independent MCQs plus five cases with five linked MCQs each** (125 marks), **three hours**, **70% standard pass mark**. Tax-law basis generally English law/practice in the 2026/27 tax year unless otherwise indicated. The CII can publish learning updates; check them before examination.

- [Official CF6 page](https://www.cii.co.uk/learning/qualifications/unit-mortgage-advice-cf6/)
- [Official 2026/27 syllabus PDF](https://media.umbraco.io/ciigroup-dxp/ewpb05xv/cf6_mortgage_advice_examination_syllabus.pdf)
- [Official 2026/27 exam guide PDF](https://media.umbraco.io/ciigroup-dxp/vn2jci1r/cf6_examination_guide_for_exams_from_1_september_2026_to_31_august_2027.pdf)
- [Supporting lender criteria for current exams](https://www.cii.co.uk/learning/qualifications/assessment-information/before-the-exam/supporting-exam-documents/)

**Original learning aids only.** These are not official CII exam questions, and tax and regulation information must be checked against CII updates and official sources. The client scenarios feature **invented lenders and explicitly fictional products**. No live lender criteria are asserted. Numeric tax-rate quizzes are deliberately omitted rather than using outdated thresholds.

## How to run locally (computer with Node.js 20.19+ or 22+)

```sh
npm install
npm run dev
```

Visit the printed local address in Safari/Chrome. To test and compile:

```sh
npm run test
npm run build
npm run preview
```

The built web application is under `dist/`.

## Free GitHub Pages publishing, with no coding required

1. Sign in to GitHub. Create a new public repository called `cf6-study-studio` (do not initialise with a README).
2. Unzip this project. Upload **all project files and folders** into the root of your new repository, including the hidden `.github/workflows/pages.yml` and `public`/`src` folders. GitHub's **Add file → Upload files** supports dragging the project contents from a computer. If you only use an iPad, GitHub web uploads can be cumbersome; a computer is easier for this one-off step.
3. In the repository, open **Settings → Pages**, choose **GitHub Actions** as the build and deployment source.
4. Open **Actions → Test and deploy CF6 Study Studio**; verify the build/test job succeeds. If not, read the job logs and fix before relying on the site.
5. After deployment the address should be `https://YOUR-USERNAME.github.io/cf6-study-studio/` (the actual address is shown under Settings → Pages). Changes committed to the `main` branch rebuild the site automatically.

The site is static. Hosting it does **not** upload any personal study progress: IndexedDB data remains in the Safari/browser storage on each device. If you later change repository name, relative asset paths should still work because Vite uses `base: './'`.

## Install on iPhone/iPad

1. Open your published site in **Safari** (not an embedded browser window) while online.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Launch **CF6 Studio** from your Home Screen. After the first online load, the app shell and practice content are cached for offline access. Safari storage is device/browser-specific; background push notifications are **not** implemented.
4. Avoid clearing Safari website data, removing PWA data, or using private browsing as your main study session. Make periodic JSON backups.

## Local storage and backup

Progress saves automatically in a single Dexie IndexedDB `progress` record (database: `CF6StudyStudio`, schema v1). The saved object includes lesson completions, session answers and timers, marked attempts, flashcard state, exam date, reminder and measured study time. New app builds preserve this database unless explicitly reset or browser storage is deleted. The service worker caches app assets for offline use. Browser-managed updates can install new assets without touching IndexedDB.

**Export:** Settings → **Export JSON backup**. Save to Files/iCloud Drive.

**Import:** Settings → **Import JSON backup**, choose the saved `.json` file, confirm overwriting that device's current state. This is *replacement*, not merge. For iPhone→iPad, export on iPhone, share the file (e.g. AirDrop/Files) and import on iPad. Repeat in reverse when needed.

**Reset:** Settings → Reset requires two confirmations. You cannot recover after reset without a backup.

## Add more questions / flashcards

Edit `src/data/questions.ts`. Questions are authored as TypeScript six-element `Row` tuples:

```ts
[
  'Unique original question stem?',
  'Correct option',
  'Plausible wrong option',
  'Plausible wrong option',
  'Plausible wrong option',
  'Explanation of why the correct option is defensible.'
]
```

Add further general practice items to `supplementaryRows` so the 100-question section A distribution remains unchanged. New lesson notes are in `src/data/syllabus.ts`, flashcards in `src/data/flashcards.ts`, and cases in `caseRows` and `cases`.

Choices are deterministically rotated so the correct answer isn't always A; stable IDs are generated from row order. **Important:** row-index-based IDs mean inserting or reordering existing rows can break historical question references in saved progress. For a future content update, switch to hand-authored immutable IDs before reorganising the bank, or append new rows only. Do not change existing question IDs or the answers to which progress refers without a migration.

**For expansion beyond the exam-weighted 100-section-A base:** add rows to a separate supplemental bank, not the original weighted sample, and have quick/daily tests include the extra bank while full exam selects exact 2026/27 section A weighting. Current data contains 100 core section A rows, 25 linked case questions, and 10 separately identified knowledge-check questions; the test asserts the section A distribution. Adjust both logic and tests together if you extend it.

Case-study rows live in `caseRows`, with corresponding fictional client profiles in `cases`. Lesson notes live in `src/data/syllabus.ts`; definition cards and recall cards are built in `src/data/flashcards.ts`. Each question stores its learning outcome, difficulty, rationale, time-sensitive flag and lesson link.

Run `npm run test` after content changes to catch duplicates, bad options, wrong weights and broken calculations. **Automated validation does not prove factual correctness.** Check technical content and distractor quality editorially.

## Current limitations / quality notes

- Full question bank target is **300+**; currently 135 authored questions. Do not claim 300. The 100 exam-weighted standalone questions are used in each full simulation, so repeated full mocks eventually reuse them. The lessons now offer five checks per outcome, but the study notes are introductory and should supplement the current official CII text.
- In-depth rules-dependent study content and all dynamic tax figures should be checked against newer official CII learning updates, the FCA Handbook and GOV.UK before your examination.
- Not a replacement for the CII current study text; not an exam guarantee. The app's readiness figure is **recent practice accuracy**, shown only after at least 50 answered items and 5 topics with three attempts each.
- Storage across devices does not sync without JSON export/import.
- Works offline **after first online installation and successful asset caching**. Google Fonts are cosmetic; system fonts take over if offline.

## Development and checks

Source tests: `src/lib/engine.test.ts` and `src/lib/storage.test.ts`. GitHub Actions installs dependencies, runs tests, typechecks and compiles on every push. Where a test/build fails, GitHub Pages deployment is blocked.

## Verification status

On 22 October 2026, the source passed offline Node/TypeScript syntax and core-engine checks: 16 outcomes, 135 unique questions (100 weighted standalone, 25 linked case and 10 supplemental), 132 flashcards, unique 125-question simulation, daily selection, scoring, spaced repetition and mortgage arithmetic. A full `npm install`, browser rendering and production Vite build could **not** be run in this creation environment because the npm registry was unreachable. GitHub Actions is configured to run `npm run test` and `npm run build` before publishing; deployment should not be considered verified until its build succeeds.

## Verification status of this delivered source archive

The question selection, answer marking, mistake mastery, flashcard intervals and mortgage calculations were checked using a stand-alone Node/TypeScript execution harness on 22 October 2026. Static TypeScript/JSX transpilation completed without syntax diagnostics. **The full Vite build, npm/Vitest command and a real Safari iOS/PWA smoke test were not run in the authoring environment because the npm registry could not be reached.** On first deployment, the bundled GitHub Actions workflow will install dependencies, run Vitest and TypeScript/Vite production build; deployment stops if these fail. Review the Actions logs and open the site on iPhone/iPad before relying on it.

This is an initial usable source implementation, not a published site, nor a guarantee that every regulatory detail or every original question has undergone independent technical peer review.
