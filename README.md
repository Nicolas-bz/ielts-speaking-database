# IELTS Speaking Corpus

A lightweight web app for generating natural spoken-style IELTS speaking answers with a built-in notebook memory system.

## Features

- **4 independent modules**
  - Speaking Part 1 (short personal answers)
  - Speaking Part 2 (cue card with Band 7 + Band 8 samples)
  - Speaking Part 3 (discussion with multi-angle reasoning)
  - Notebook (saved prompts, answers, vocabulary, and reusable expressions)
- **IELTS-aligned output strategy**
  - Spoken-style (not essay-like)
  - Band 7 vs Band 8 distinction
  - Useful phrases, collocations, and informal expressions
- **Notebook tools**
  - Auto-save generated outputs
  - Search by keyword
  - Filter by speaking part

## Run locally

Because this is a static app, you can open `index.html` directly in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`
