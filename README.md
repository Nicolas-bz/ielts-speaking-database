# IELTS Fill-in-the-Blank Exercise Generator

A browser-based app for teachers to create IELTS listening/reading gap-fill exercises.

## Features

- Paste text or upload **PDF/DOCX**.
- Keeps dialogue formatting and supports editable text display.
- Select one or multiple words to create one blank.
- Optional first-letter hint (e.g., `d______`).
- Right-side answer panel with editable answers.
- Copy questions, answers, or both.
- Export to DOCX and PDF.
- Reset to original text.
- Optional enhancements:
  - Auto difficult-vocabulary blank suggestion.
  - Random blank generation (5–10 blanks).
  - Save/load exercises (LocalStorage).
  - Teacher mode / Student mode.

## Run locally

Because the app uses ES modules and CDN libraries, run with any static server:

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`

## Usage

1. Paste text or upload a file.
2. Click **Load Text**.
3. Highlight one word or a phrase in the left text panel.
4. Release mouse to convert to a blank.
5. Edit answers in the right panel.
6. Copy or export as needed.
7. Use **Student mode** to hide answer editing.
