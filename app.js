import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.min.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs';

const els = {
  sourceInput: document.getElementById('sourceInput'),
  fileInput: document.getElementById('fileInput'),
  loadTextBtn: document.getElementById('loadTextBtn'),
  textCanvas: document.getElementById('textCanvas'),
  answerList: document.getElementById('answerList'),
  hintToggle: document.getElementById('hintToggle'),
  copyQuestionsBtn: document.getElementById('copyQuestionsBtn'),
  copyAnswersBtn: document.getElementById('copyAnswersBtn'),
  copyBothBtn: document.getElementById('copyBothBtn'),
  exportDocxBtn: document.getElementById('exportDocxBtn'),
  exportPdfBtn: document.getElementById('exportPdfBtn'),
  resetBtn: document.getElementById('resetBtn'),
  autoDifficultBtn: document.getElementById('autoDifficultBtn'),
  autoRandomBtn: document.getElementById('autoRandomBtn'),
  teacherModeBtn: document.getElementById('teacherModeBtn'),
  studentModeBtn: document.getElementById('studentModeBtn'),
  saveExerciseBtn: document.getElementById('saveExerciseBtn'),
  loadExerciseBtn: document.getElementById('loadExerciseBtn'),
};

let state = { originalText: '', tokens: [], blanks: [], teacherMode: true };

const tokenize = (text) => {
  const parts = text.match(/\r?\n|\s+|\p{L}[\p{L}'’-]*|\p{N}+|[^\s\p{L}\p{N}]/gu) || [];
  return parts.map((value, idx) => ({ idx, value, isWord: /^\p{L}[\p{L}'’-]*$/u.test(value) }));
};

const isSpeakerLabel = (tokens, i) => tokens[i]?.isWord && tokens[i + 1]?.value === ':';

const buildBlankText = (answer, hint) => {
  const clean = answer.replace(/\s+/g, ' ').trim();
  const base = '_'.repeat(Math.max(6, clean.length + 2));
  return hint && clean ? `${clean[0]}${base}` : base;
};

function render() {
  els.textCanvas.innerHTML = '';
  const blankByToken = new Map();
  state.blanks.forEach((b, i) => b.tokenIndexes.forEach((t) => blankByToken.set(t, i)));

  state.tokens.forEach((token, i) => {
    const span = document.createElement('span');
    if (token.value === '\n' || token.value === '\r\n') {
      els.textCanvas.append(document.createElement('br'));
      return;
    }

    const blankIndex = blankByToken.get(i);
    if (blankIndex !== undefined) {
      if (state.blanks[blankIndex].tokenIndexes[0] !== i) return;
      span.className = 'blank';
      span.dataset.blank = String(blankIndex);
      span.textContent = buildBlankText(state.blanks[blankIndex].answer, state.blanks[blankIndex].hint);
      span.title = 'Click blank to remove';
      if (!state.teacherMode) span.dataset.student = '1';
      els.textCanvas.append(span);
      return;
    }

    span.textContent = token.value;
    if (token.isWord) span.classList.add('word');
    if (isSpeakerLabel(state.tokens, i)) span.classList.add('speaker');
    span.dataset.token = String(i);
    els.textCanvas.append(span);
  });

  renderAnswers();
}

function renderAnswers() {
  els.answerList.innerHTML = '';
  state.blanks.forEach((blank, i) => {
    const item = document.createElement('li');
    item.innerHTML = `<label>#${i + 1}<input data-answer="${i}" value="${blank.answer}" ${state.teacherMode ? '' : 'disabled'} /></label>`;
    els.answerList.append(item);
  });
}

function createBlankFromSelection() {
  const sel = window.getSelection();
  if (!sel || sel.isCollapsed || !state.teacherMode) return;
  const range = sel.getRangeAt(0);
  const selected = [...els.textCanvas.querySelectorAll('[data-token]')].filter((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    return range.compareBoundaryPoints(Range.END_TO_START, r) < 0 && range.compareBoundaryPoints(Range.START_TO_END, r) > 0;
  });
  const indexes = selected.map((el) => Number(el.dataset.token)).filter((i) => state.tokens[i].isWord);
  if (!indexes.length) return;

  const min = Math.min(...indexes);
  const max = Math.max(...indexes);
  const phraseTokens = state.tokens.slice(min, max + 1).filter((t) => t.isWord).map((t) => t.idx);
  if (!phraseTokens.length || state.blanks.some((b) => b.tokenIndexes.some((x) => phraseTokens.includes(x)))) return;

  const answer = state.tokens.slice(min, max + 1).map((t) => t.value).join('').replace(/\s+/g, ' ').trim();
  state.blanks.push({ tokenIndexes: phraseTokens, answer, hint: els.hintToggle.checked });
  sel.removeAllRanges();
  render();
}

function serializeQuestions() {
  const blankByToken = new Map();
  state.blanks.forEach((b, i) => b.tokenIndexes.forEach((t) => blankByToken.set(t, i)));
  let out = '';
  for (let i = 0; i < state.tokens.length; i++) {
    const t = state.tokens[i];
    if (t.value === '\n' || t.value === '\r\n') {
      out += '\n';
      continue;
    }
    const bi = blankByToken.get(i);
    if (bi !== undefined) {
      if (state.blanks[bi].tokenIndexes[0] !== i) continue;
      out += `(${bi + 1}) ${buildBlankText(state.blanks[bi].answer, state.blanks[bi].hint)}`;
      continue;
    }
    out += t.value;
  }
  return out;
}

const serializeAnswers = () => state.blanks.map((b, i) => `${i + 1}. ${b.answer}`).join('\n');

async function readPdfText(file) {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += `${content.items.map((it) => it.str).join(' ')}\n`;
  }
  return text;
}

async function readDocxText(file) {
  const arr = await file.arrayBuffer();
  const res = await window.mammoth.extractRawText({ arrayBuffer: arr });
  return res.value;
}

function downloadBlob(filename, blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadText(text) {
  state.originalText = text;
  state.tokens = tokenize(text);
  state.blanks = [];
  render();
}

els.loadTextBtn.addEventListener('click', async () => {
  const file = els.fileInput.files?.[0];
  let text = els.sourceInput.value;
  if (file) {
    if (file.name.toLowerCase().endsWith('.pdf')) text = await readPdfText(file);
    if (file.name.toLowerCase().endsWith('.docx')) text = await readDocxText(file);
    els.sourceInput.value = text;
  }
  loadText(text);
});

els.textCanvas.addEventListener('mouseup', createBlankFromSelection);
els.textCanvas.addEventListener('click', (e) => {
  if (!state.teacherMode) return;
  const blankEl = e.target.closest('.blank');
  if (!blankEl) return;
  state.blanks.splice(Number(blankEl.dataset.blank), 1);
  render();
});

els.answerList.addEventListener('input', (e) => {
  const idx = e.target.dataset.answer;
  if (idx === undefined) return;
  state.blanks[Number(idx)].answer = e.target.value;
  render();
});

els.copyQuestionsBtn.addEventListener('click', () => navigator.clipboard.writeText(serializeQuestions()));
els.copyAnswersBtn.addEventListener('click', () => navigator.clipboard.writeText(serializeAnswers()));
els.copyBothBtn.addEventListener('click', () => navigator.clipboard.writeText(`${serializeQuestions()}\n\nAnswer Key\n${serializeAnswers()}`));

els.exportDocxBtn.addEventListener('click', async () => {
  const { Document, Packer, Paragraph, TextRun } = window.docx;
  const doc = new Document({ sections: [{ children: [new Paragraph({ children: [new TextRun(serializeQuestions())] }), new Paragraph(''), new Paragraph('Answer Key'), new Paragraph(serializeAnswers())] }] });
  downloadBlob('ielts-gap-fill.docx', await Packer.toBlob(doc));
});

els.exportPdfBtn.addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const content = `${serializeQuestions()}\n\nAnswer Key\n${serializeAnswers()}`;
  const lines = doc.splitTextToSize(content, 180);
  doc.text(lines, 15, 15);
  doc.save('ielts-gap-fill.pdf');
});

els.resetBtn.addEventListener('click', () => loadText(state.originalText));
els.autoDifficultBtn.addEventListener('click', () => {
  const difficult = state.tokens.filter((t) => t.isWord && t.value.length >= 8).slice(0, 10);
  difficult.forEach((token) => {
    if (!state.blanks.some((b) => b.tokenIndexes.includes(token.idx))) {
      state.blanks.push({ tokenIndexes: [token.idx], answer: token.value, hint: els.hintToggle.checked });
    }
  });
  render();
});
els.autoRandomBtn.addEventListener('click', () => {
  const words = state.tokens.filter((t) => t.isWord);
  const n = Math.min(words.length, Math.floor(Math.random() * 6) + 5);
  for (const token of [...words].sort(() => Math.random() - 0.5).slice(0, n)) {
    if (!state.blanks.some((b) => b.tokenIndexes.includes(token.idx))) {
      state.blanks.push({ tokenIndexes: [token.idx], answer: token.value, hint: els.hintToggle.checked });
    }
  }
  render();
});

els.teacherModeBtn.addEventListener('click', () => {
  state.teacherMode = true;
  els.teacherModeBtn.classList.add('active');
  els.studentModeBtn.classList.remove('active');
  render();
});
els.studentModeBtn.addEventListener('click', () => {
  state.teacherMode = false;
  els.studentModeBtn.classList.add('active');
  els.teacherModeBtn.classList.remove('active');
  render();
});

els.saveExerciseBtn.addEventListener('click', () => {
  localStorage.setItem('ielts-gap-fill', JSON.stringify(state));
});
els.loadExerciseBtn.addEventListener('click', () => {
  const saved = localStorage.getItem('ielts-gap-fill');
  if (!saved) return;
  state = JSON.parse(saved);
  render();
});
