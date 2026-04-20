# Lantern Quest Storybook

Lantern Quest Storybook is a static GitHub Pages web app that helps a child understand, memorize, and recite Henry Wadsworth Longfellow's "Paul Revere's Ride." The current build treats the first assigned section, lines `42-65`, as an interactive storybook chapter sequence first and a memorization tool second.

## What it includes

- A meaning-first preface explaining why the poem matters
- A chapter-based interactive storybook flow for the first assigned section
- Scene actions inside the illustrated spread so the child acts on the poem before memorizing it
- Memorize Mode with five stages of support
- Prove-It Mode with typed fallback and browser microphone support when available
- Fuzzy recitation checking with adjustable strictness
- Local save data using `localStorage`
- Parent controls for manual/automatic scheduling, speech toggles, explanations, import/export, and reset
- A live countdown showing the next due date and line range
- Phoenix-based clock sync using a public time API with browser-time fallback
- A four-beat cadence helper to support rhythm and memorization

## Project structure

```text
.
|- app.js
|- content/
|  |- poem-data.json
|  |- story-art-prompts.json
|  `- schedule-config.json
|- index.html
|- README.md
`- styles.css
```

## Run locally

Because the app loads JSON with `fetch`, serve the folder through a local web server instead of opening `index.html` directly.

### Option 1: Python

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

### Option 2: VS Code Live Server

Open the folder in VS Code and run Live Server on the repo root.

## GitHub Pages deployment

1. Create a new public GitHub repository.
2. Put all repo files at the repository root.
3. Commit and push to your default branch, usually `main`.
4. In GitHub, open `Settings` -> `Pages`.
5. Under `Build and deployment`, choose:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/ (root)`
6. Click `Save`.
7. Wait for Pages deployment to finish.
8. Your live URL will be:
   - `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

This repo is already Pages-safe:

- all CSS, JS, and JSON paths are relative
- no server routes are required
- no build step is required

## Schedule and progression

The app supports two progression styles:

- Automatic mode: the app follows the schedule dates, but also unlocks the next section early when the child fully masters the current one
- Manual mode: the parent can choose the active section directly

While the page is open, the app also shows a live countdown for the next due section and line range.

## Where to edit content later

You usually edit these two files:

- `content/poem-data.json`
- `content/schedule-config.json`

For custom illustrated story spreads, also use:

- `content/story-art-prompts.json`
- `content/storybook-page-prompts.json`

### Edit poem lines

Each line in `content/poem-data.json` looks like this:

```json
{
  "lineNumber": 42,
  "text": "Beneath, in the churchyard, lay the dead,",
  "sceneTag": "churchyard-watch",
  "keywords": ["churchyard", "dead"],
  "kidExplanation": "He looks down from the tower and sees the graveyard below."
}
```

### Edit the schedule

Each section in `content/schedule-config.json` looks like this:

```json
{
  "id": "churchyard-watch",
  "title": "Churchyard Watch",
  "description": "Starts with the graveyard scene and moves toward the first lantern glow.",
  "lineStart": 42,
  "lineEnd": 65,
  "unlockDate": "2026-04-17",
  "checkpointSize": 4
}
```

The same file also contains:

- `scheduleTimezone`: trusted-clock settings for Phoenix, AZ
- `storybookIntro`: the preface content shown before the child begins
- `strictnessLevels`: recital thresholds

## Current product shape

The first section, lines `42-65`, is the most complete chapter flow in this build. It includes a guided storybook sequence with scene actions tied to meaning before memorization.

Later sections still use the same scheduling, save, and recital systems, but they are not yet as custom-authored as the first section.

## Story art generation

Use `content/story-art-prompts.json` to generate scene-by-scene storybook art for the full poem.

Use `content/storybook-page-prompts.json` when you want a true page-turn workflow instead of one image per chunk. That file is more granular and is the better starting point for the first assigned section.

That file includes:

- a consistent voxel-inspired colonial Boston art direction
- continuity notes for Paul Revere, the watcher, the church, and the harbor
- one prompt at a time for major scenes across the whole poem

Important guardrail:

- Keep the work `voxel-inspired` and `block-built`, but do not use copyrighted Minecraft logos, UI, characters, or exact branded assets.

## Clock behavior

- Current time is synced from `https://worldtimeapi.org/api/timezone/America/Phoenix` when available
- If that request fails, the app falls back to browser time
- Due dates are treated as due by `11:59:59 PM` Phoenix time on the scheduled date

## Suggested commit messages

- `feat: rebuild first section as interactive storybook`
- `feat: add cadence helper and meaning-first preface`
- `feat: connect chapter scenes to memorize and recital flow`
- `docs: update readme for storybook product direction`
