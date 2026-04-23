# IELTS Speaking Corpus

A lightweight web app for IELTS Speaking practice that focuses on natural, native-like spoken English, clear Band 7 vs Band 8 differentiation, and exportable study notes.

## Features

- **Speaking Part 1**
  - 2–4 sentence conversational answers
  - Direct answer + extension + specific example

- **Speaking Part 2**
  - 60–90 second storytelling-style answers
  - Built with: opening, background, main story, sensory/emotional details, reflection

- **Speaking Part 3**
  - 4–6 sentence analytical spoken answers
  - Includes opinion, explanation, example, and alternative view

- **Language support output for every question**
  - 🔑 Key Phrases (3–5)
  - 📚 Topic Vocabulary (3–5)
  - 🗣 Natural Expressions / Slang (2–3)
  - 🧱 Useful Sentence Patterns (2–3)
  - 🎯 Band 7 Answer
  - 🚀 Band 8 Answer

- **Notebook memory system**
  - Auto-saves generated prompts/answers
  - Search by keyword
  - Filter by part

- **Export features**
  - Export notebook as **PDF (A4)** using `jsPDF`
  - Export notebook as **DOCX (A4)** using `docx`
  - Per-question sections with question, vocabulary blocks, Band 7 answer, Band 8 answer
  - Page breaks and print-friendly formatting

## Run locally

Open `index.html` directly or run:

```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`
