const storageKey = "ielts-speaking-notebook";

const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

const topicKeywords = {
  Education: ["school", "study", "learn", "university", "teacher", "education", "class"],
  Technology: ["technology", "phone", "app", "internet", "online", "computer", "ai"],
  Environment: ["environment", "climate", "pollution", "recycle", "green", "nature"],
  Travel: ["travel", "trip", "journey", "holiday", "tour", "visit", "abroad"],
  Work: ["job", "work", "career", "office", "salary", "boss", "company"],
  Health: ["health", "exercise", "diet", "sleep", "mental", "fitness", "stress"],
  Lifestyle: ["hobby", "music", "movie", "food", "shopping", "weekend", "friends"],
};

const languageBank = {
  keyPhrases: [
    "to be honest",
    "if I’m being real",
    "one thing I’ve noticed is",
    "it makes a big difference",
    "that’s what works for me",
    "I tend to",
    "I ended up",
  ],
  topicVocab: [
    "daily routine",
    "long-term impact",
    "practical solution",
    "strong impression",
    "sense of confidence",
    "social pressure",
    "personal growth",
  ],
  naturalExpressions: ["kind of", "pretty chill", "super handy", "not really my thing", "works like a charm"],
  sentencePatterns: [
    "I’d say ___, mainly because ___.",
    "What stands out to me is ___, especially when ___.",
    "From my experience, ___, but it also depends on ___.",
    "The reason I feel this way is that ___.",
  ],
};

function randomPick(list, count) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizePrompt(text) {
  return text.trim().replace(/\s+/g, " ").replace(/\?+$/, "");
}

function detectTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, words] of Object.entries(topicKeywords)) {
    if (words.some((word) => lower.includes(word))) return topic;
  }
  return "General";
}

function makeLanguageOutput() {
  return {
    keyPhrases: randomPick(languageBank.keyPhrases, 4),
    topicVocabulary: randomPick(languageBank.topicVocab, 4),
    naturalExpressions: randomPick(languageBank.naturalExpressions, 3),
    sentencePatterns: randomPick(languageBank.sentencePatterns, 3),
  };
}

function renderList(title, items) {
  return `<h4>${title}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function generatePart1(question) {
  const prompt = normalizePrompt(question).toLowerCase();

  const band7 = [
    `Well, I’d say yes, generally, because ${prompt} is part of my normal routine.`,
    "I keep it simple and practical, so it doesn’t feel stressful.",
    "For example, this week I did it twice after dinner, and it actually helped me relax.",
  ].join(" ");

  const band8 = [
    `Honestly, I’m mostly positive about it, but it depends on my schedule.`,
    `I tend to handle ${prompt} in a flexible way, so I can stay consistent without forcing it.`,
    "Like yesterday, I only had 20 minutes, but I still managed to do a quick version and felt good about it.",
  ].join(" ");

  return {
    band7,
    band8,
    structureCheck: "2–4 sentences, direct answer + extension + specific example included.",
    ...makeLanguageOutput(),
  };
}

function generatePart2(cueCard) {
  const prompt = normalizePrompt(cueCard);
  const topic = detectTopic(prompt);

  const band7 = `Well, I’d like to talk about ${prompt.toLowerCase()}, because it was a really memorable experience for me. It happened a few months ago when I had a free weekend and decided to do something different from my usual routine. At first, I didn’t expect much, but once I got there, everything felt surprisingly enjoyable and natural. The main moment I remember is how comfortable I felt with the people around me, and that made the whole experience smoother. I can still picture the atmosphere clearly—the sounds, the weather, and even small details like what we were talking about. Emotionally, I felt calm but excited at the same time, which is quite rare for me. Looking back, it mattered because it gave me confidence and reminded me that simple moments can be incredibly meaningful.`;

  const band8 = `Honestly, one experience that really stands out is ${prompt.toLowerCase()}, and it still feels vivid when I think about it now. This happened during a busy period in my life, so I almost cancelled it, but I’m so glad I didn’t. In the beginning, I was a bit unsure and kind of tired, yet the situation changed quickly once I got involved. The story itself isn’t dramatic, but it felt deeply personal because I noticed so many little details—the tone of people’s voices, the background sounds, and the way my mood shifted minute by minute. I remember feeling a mix of excitement, relief, and gratitude, which made the experience feel very real rather than staged. What impressed me most was how naturally everything unfolded, without me trying to control it. In hindsight, it became a turning point, because since then I’ve been more open to new experiences and less afraid of uncertainty.`;

  return {
    topic,
    band7,
    band8,
    structureCheck: "Opening + background + main story + sensory/emotional details + reflection included.",
    ...makeLanguageOutput(),
  };
}

function generatePart3(question) {
  const prompt = normalizePrompt(question);
  const topic = detectTopic(prompt);

  const band7 = [
    `Well, in my view, ${prompt.toLowerCase()} has more advantages than disadvantages overall.`,
    `The main reason is that ${topic.toLowerCase()} can make daily life more efficient and less stressful for most people.`,
    "For example, in my own life, even one small change saved me time every week and improved my routine.",
    "That said, some people argue it can create pressure or unfair gaps, and I think that’s a fair concern.",
    "So I’d support it, but only with reasonable limits and support for people who struggle.",
  ].join(" ");

  const band8 = [
    `Honestly, I’d argue that ${prompt.toLowerCase()} is broadly positive, but only when it’s managed responsibly.`,
    `My reasoning is that at an individual level it usually boosts convenience, confidence, and access to opportunities.`,
    "A clear example is how people can now solve practical problems faster than before, which changes everyday decision-making.",
    "However, an alternative view is that not everyone benefits equally, and this can deepen social inequality over time.",
    "So from a broader perspective, I support progress, but it needs policy support and public awareness to stay fair.",
  ].join(" ");

  return {
    topic,
    band7,
    band8,
    structureCheck: "4–6 sentences, opinion + explanation + example + alternative view included.",
    ...makeLanguageOutput(),
  };
}

function renderLanguageSection(result) {
  return `
    ${renderList("🔑 Key Phrases (3–5)", result.keyPhrases)}
    ${renderList("📚 Topic Vocabulary (3–5)", result.topicVocabulary)}
    ${renderList("🗣 Natural Expressions / Slang (2–3)", result.naturalExpressions)}
    ${renderList("🧱 Useful Sentence Patterns (2–3)", result.sentencePatterns)}
  `;
}

function buildPart1Html(result) {
  return `
    <div class="card">
      <h3>🎯 Band 7 Answer</h3>
      <p>${escapeHtml(result.band7)}</p>
      <h3>🚀 Band 8 Answer</h3>
      <p>${escapeHtml(result.band8)}</p>
      <p class="meta"><strong>Structure check:</strong> ${escapeHtml(result.structureCheck)}</p>
      ${renderLanguageSection(result)}
    </div>
  `;
}

function buildPart2Html(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 2</span><span class="badge topic">${escapeHtml(result.topic)}</span></h3>
      <h4>🎯 Band 7 Answer (60–90 sec style)</h4>
      <p>${escapeHtml(result.band7)}</p>
      <h4>🚀 Band 8 Answer (60–90 sec style)</h4>
      <p>${escapeHtml(result.band8)}</p>
      <p class="meta"><strong>Structure check:</strong> ${escapeHtml(result.structureCheck)}</p>
      ${renderLanguageSection(result)}
    </div>
  `;
}

function buildPart3Html(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 3</span><span class="badge topic">${escapeHtml(result.topic)}</span></h3>
      <h4>🎯 Band 7 Answer</h4>
      <p>${escapeHtml(result.band7)}</p>
      <h4>🚀 Band 8 Answer</h4>
      <p>${escapeHtml(result.band8)}</p>
      <p class="meta"><strong>Structure check:</strong> ${escapeHtml(result.structureCheck)}</p>
      ${renderLanguageSection(result)}
    </div>
  `;
}

function loadNotebook() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveNotebook(entries) {
  localStorage.setItem(storageKey, JSON.stringify(entries));
}

function saveGenerated(part, input, result, htmlPreview) {
  const entries = loadNotebook();
  entries.unshift({
    id: crypto.randomUUID(),
    part,
    topic: detectTopic(input),
    input,
    result,
    htmlPreview,
    createdAt: new Date().toISOString(),
  });
  saveNotebook(entries);
  renderNotebook();
}

function renderNotebook() {
  const search = document.querySelector("#search-input").value.trim().toLowerCase();
  const filter = document.querySelector("#filter-part").value;
  const out = document.querySelector("#notebook-output");

  const filtered = loadNotebook().filter((entry) => {
    const byPart = filter === "all" || String(entry.part) === filter;
    const bySearch =
      !search || `${entry.input} ${entry.topic} ${JSON.stringify(entry.result)}`.toLowerCase().includes(search);
    return byPart && bySearch;
  });

  if (!filtered.length) {
    out.innerHTML = "<p class='meta'>No notebook items match your filter.</p>";
    return;
  }

  out.innerHTML = filtered
    .map(
      (entry) => `
      <div class="card">
        <div>
          <span class="badge part">Part ${entry.part}</span>
          <span class="badge topic">${escapeHtml(entry.topic)}</span>
        </div>
        <p class="meta">Saved: ${new Date(entry.createdAt).toLocaleString()}</p>
        <p><strong>Question / Prompt:</strong> ${escapeHtml(entry.input)}</p>
        <details>
          <summary>Reuse expressions and answer content</summary>
          ${entry.htmlPreview}
        </details>
      </div>
    `,
    )
    .join("");
}

function exportableBlocks(entries) {
  return entries.map((entry, idx) => ({
    title: `Question ${idx + 1} — Part ${entry.part} (${entry.topic})`,
    question: entry.input,
    keyPhrases: entry.result.keyPhrases || [],
    topicVocabulary: entry.result.topicVocabulary || [],
    naturalExpressions: entry.result.naturalExpressions || [],
    sentencePatterns: entry.result.sentencePatterns || [],
    band7: entry.result.band7 || "",
    band8: entry.result.band8 || "",
  }));
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth);
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

function ensurePdfSpace(doc, y, needed, margin = 15) {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - margin) {
    doc.addPage();
    return margin;
  }
  return y;
}

function exportNotebookPdf() {
  const entries = loadNotebook();
  if (!entries.length) return alert("Notebook is empty. Generate content first.");

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const blocks = exportableBlocks(entries);
  const margin = 15;
  const width = 180;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("IELTS Speaking Corpus Export", margin, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  blocks.forEach((block, index) => {
    y = ensurePdfSpace(doc, y, 40, margin);
    doc.setFont("helvetica", "bold");
    y = addWrappedText(doc, block.title, margin, y, width, 6);

    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, `Question: ${block.question}`, margin, y + 1, width, 6);

    const sections = [
      ["Key Phrases", block.keyPhrases],
      ["Topic Vocabulary", block.topicVocabulary],
      ["Natural Expressions", block.naturalExpressions],
      ["Useful Sentence Patterns", block.sentencePatterns],
    ];

    sections.forEach(([name, items]) => {
      y = ensurePdfSpace(doc, y, 18, margin);
      doc.setFont("helvetica", "bold");
      doc.text(`${name}:`, margin, y + 1);
      y += 6;
      doc.setFont("helvetica", "normal");
      items.forEach((item) => {
        y = ensurePdfSpace(doc, y, 8, margin);
        y = addWrappedText(doc, `• ${item}`, margin + 2, y, width - 2, 5.5);
      });
    });

    y = ensurePdfSpace(doc, y, 22, margin);
    doc.setFont("helvetica", "bold");
    doc.text("Band 7 Answer:", margin, y + 1);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, block.band7, margin, y + 7, width, 5.5);

    y = ensurePdfSpace(doc, y, 22, margin);
    doc.setFont("helvetica", "bold");
    doc.text("Band 8 Answer:", margin, y + 1);
    doc.setFont("helvetica", "normal");
    y = addWrappedText(doc, block.band8, margin, y + 7, width, 5.5);

    if (index < blocks.length - 1) {
      doc.addPage();
      y = margin;
      doc.setFontSize(11);
    }
  });

  doc.save("ielts-speaking-corpus.pdf");
}

async function exportNotebookDocx() {
  const entries = loadNotebook();
  if (!entries.length) return alert("Notebook is empty. Generate content first.");

  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    PageBreak,
  } = window.docx;

  const blocks = exportableBlocks(entries);
  const children = [
    new Paragraph({
      text: "IELTS Speaking Corpus Export",
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.LEFT,
      spacing: { after: 280 },
    }),
  ];

  blocks.forEach((block, index) => {
    children.push(
      new Paragraph({ text: block.title, heading: HeadingLevel.HEADING_1, spacing: { before: 120, after: 120 } }),
      new Paragraph({ children: [new TextRun({ text: `Question: ${block.question}` })], spacing: { after: 120 } }),
      new Paragraph({ text: "Key Phrases", heading: HeadingLevel.HEADING_2 }),
      ...block.keyPhrases.map((item) => new Paragraph({ text: `• ${item}`, spacing: { after: 60 } })),
      new Paragraph({ text: "Topic Vocabulary", heading: HeadingLevel.HEADING_2 }),
      ...block.topicVocabulary.map((item) => new Paragraph({ text: `• ${item}`, spacing: { after: 60 } })),
      new Paragraph({ text: "Natural Expressions", heading: HeadingLevel.HEADING_2 }),
      ...block.naturalExpressions.map((item) => new Paragraph({ text: `• ${item}`, spacing: { after: 60 } })),
      new Paragraph({ text: "Useful Sentence Patterns", heading: HeadingLevel.HEADING_2 }),
      ...block.sentencePatterns.map((item) => new Paragraph({ text: `• ${item}`, spacing: { after: 60 } })),
      new Paragraph({ text: "Band 7 Answer", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: block.band7, spacing: { after: 150 } }),
      new Paragraph({ text: "Band 8 Answer", heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ text: block.band8, spacing: { after: 180 } }),
    );

    if (index < blocks.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
          },
        },
        children,
      },
    ],
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 22,
          },
        },
      },
    },
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "ielts-speaking-corpus.docx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function setupTabs() {
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((tab) => tab.classList.toggle("active", tab === btn));
      panels.forEach((panel) => panel.classList.toggle("active", panel.id === btn.dataset.tab));
    });
  });
}

function setupActions() {
  document.querySelector("#part1-generate").addEventListener("click", () => {
    const input = document.querySelector("#part1-input").value.trim();
    if (!input) return;
    const result = generatePart1(input);
    const html = buildPart1Html(result);
    document.querySelector("#part1-output").innerHTML = html;
    saveGenerated(1, input, result, html);
  });

  document.querySelector("#part2-generate").addEventListener("click", () => {
    const input = document.querySelector("#part2-input").value.trim();
    if (!input) return;
    const result = generatePart2(input);
    const html = buildPart2Html(result);
    document.querySelector("#part2-output").innerHTML = html;
    saveGenerated(2, input, result, html);
  });

  document.querySelector("#part3-generate").addEventListener("click", () => {
    const input = document.querySelector("#part3-input").value.trim();
    if (!input) return;
    const result = generatePart3(input);
    const html = buildPart3Html(result);
    document.querySelector("#part3-output").innerHTML = html;
    saveGenerated(3, input, result, html);
  });

  document.querySelector("#search-input").addEventListener("input", renderNotebook);
  document.querySelector("#filter-part").addEventListener("change", renderNotebook);
  document.querySelector("#clear-notebook").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderNotebook();
  });
  document.querySelector("#export-pdf").addEventListener("click", exportNotebookPdf);
  document.querySelector("#export-docx").addEventListener("click", exportNotebookDocx);
}

setupTabs();
setupActions();
renderNotebook();
