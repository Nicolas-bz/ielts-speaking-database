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

const toolkit = {
  fillers: ["Well,", "Honestly,", "To be fair,", "I mean,", "You know,"],
  phrases: [
    "to be honest",
    "at the end of the day",
    "I’d say it depends",
    "one thing I’ve noticed",
    "it makes a huge difference",
    "I’m really into",
    "I ended up",
    "it just feels right",
    "that’s what works for me",
  ],
  collocations: [
    "heavy workload",
    "make progress",
    "daily routine",
    "strong impression",
    "social pressure",
    "time management",
    "long-term impact",
    "practical solution",
  ],
  slang: [
    "kind of",
    "super handy",
    "a game-changer",
    "not my thing",
    "pretty chill",
    "works like a charm",
  ],
  part3Markers: [
    "Well, it really depends...",
    "From a broader perspective...",
    "If you look at it another way...",
    "That said,",
    "On balance,",
  ],
  part2Links: [
    "To start with",
    "What stands out most is",
    "The thing is",
    "Another detail I remember is",
    "Looking back",
    "All in all",
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

function generateLanguagePack() {
  return {
    phrases: randomPick(toolkit.phrases, 5),
    collocations: randomPick(toolkit.collocations, 4),
    slang: randomPick(toolkit.slang, 3),
  };
}

function renderList(title, items) {
  return `<h4>${title}</h4><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function generatePart1(question) {
  const q = normalizePrompt(question).toLowerCase();
  const opener = randomPick(toolkit.fillers, 1)[0];

  const band7 = `${opener} yes, generally. ${q} is part of my normal routine, so I keep it simple and realistic. I’m not perfect every day, but I stay consistent and that helps.`;
  const band8 = `${opener} I’d say mostly yes, but it depends on the day. ${q} comes up quite naturally in my life, and I’ve learned to manage it in a way that feels sustainable. So overall, it’s positive, and I can give a quick example if needed.`;

  return {
    band7,
    band8,
    expansionIdeas: [
      "Add a quick personal example from this week.",
      "Compare now vs a few years ago.",
      "Mention one challenge and how you deal with it.",
    ],
    ...generateLanguagePack(),
  };
}

function generatePart2(cueCard) {
  const prompt = normalizePrompt(cueCard);
  const topic = detectTopic(prompt);

  const intro7 = `I’m going to talk about ${prompt.toLowerCase()}.`;
  const story7 = "It happened quite naturally, not as a big plan, and that made it more memorable.";
  const details7 = "I remember where I was, who I was with, and a couple of small details that still feel vivid now.";
  const reflection7 = "Looking back, it was meaningful because it reminded me to enjoy simple moments instead of overthinking everything.";

  const intro8 = `I’d like to describe ${prompt.toLowerCase()}, because it genuinely left a lasting impression on me.`;
  const story8 = "At first, I wasn’t sure what to expect, but once things got going, I felt a mix of excitement and nervousness.";
  const details8 = "What really stayed with me was the atmosphere, the little reactions from people around me, and how quickly my mood changed during the experience.";
  const reflection8 = "In hindsight, it was a turning point. Since then, I’ve approached similar situations with more confidence, flexibility, and gratitude.";

  return {
    topic,
    structures: {
      band7: { intro: intro7, story: story7, details: details7, reflection: reflection7 },
      band8: { intro: intro8, story: story8, details: details8, reflection: reflection8 },
    },
    links: randomPick(toolkit.part2Links, 5),
    vocabBank: randomPick(
      [
        "memorable occasion",
        "vivid detail",
        "mixed feelings",
        "turning point",
        "sense of achievement",
        "special atmosphere",
        "personal growth",
        "lasting impression",
      ],
      6,
    ),
    ...generateLanguagePack(),
  };
}

function generatePart3(question) {
  const prompt = normalizePrompt(question);
  const topic = detectTopic(prompt);

  const band7 = [
    "Well, it really depends on the context.",
    `From one perspective, ${topic.toLowerCase()} brings clear practical benefits in everyday life, especially for convenience and access.`,
    "From another perspective, it can create pressure or inequality if some people are left behind.",
    "So my view is positive overall, but only when there is balance and fair support.",
  ];

  const band8 = [
    "Well, it really depends, and I think we need to separate individual and social impacts.",
    `At an individual level, ${topic.toLowerCase()} often improves efficiency, confidence, and opportunity almost immediately.`,
    "However, at a broader level, the same trend can deepen social gaps unless policy and education keep pace.",
    "So I’d argue the best approach is a balanced one: encourage progress, but build safeguards at the same time.",
  ];

  return {
    topic,
    question: prompt,
    perspectives: [
      "Perspective 1: benefits in daily life",
      "Perspective 2: risks and long-term social effects",
    ],
    band7,
    band8,
    markers: randomPick(toolkit.part3Markers, 4),
    ...generateLanguagePack(),
  };
}

function buildPart1Html(result) {
  return `
    <div class="card">
      <h3>Band 7 Answer</h3>
      <p>${escapeHtml(result.band7)}</p>
      <h3>Band 8 Answer</h3>
      <p>${escapeHtml(result.band8)}</p>
      ${renderList("Useful Phrases (5)", result.phrases)}
      ${renderList("Collocations (4)", result.collocations)}
      ${renderList("Spoken / Informal Expressions (3)", result.slang)}
      ${renderList("Optional Expansion Ideas", result.expansionIdeas)}
    </div>
  `;
}

function buildStructuredAnswer(structure) {
  return `
    <ul>
      <li><strong>Introduction:</strong> ${escapeHtml(structure.intro)}</li>
      <li><strong>Story / Description:</strong> ${escapeHtml(structure.story)}</li>
      <li><strong>Details:</strong> ${escapeHtml(structure.details)}</li>
      <li><strong>Reflection / Feeling:</strong> ${escapeHtml(structure.reflection)}</li>
    </ul>
  `;
}

function buildPart2Html(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 2</span><span class="badge topic">${escapeHtml(result.topic)}</span></h3>
      <h4>Band 7 Sample (Structured)</h4>
      ${buildStructuredAnswer(result.structures.band7)}
      <h4>Band 8 Sample (Structured)</h4>
      ${buildStructuredAnswer(result.structures.band8)}
      ${renderList("Fluency Linking Phrases", result.links)}
      ${renderList("Topic Vocabulary Bank", result.vocabBank)}
      ${renderList("Useful Phrases (5)", result.phrases)}
      ${renderList("Collocations (4)", result.collocations)}
      ${renderList("Spoken / Informal Expressions (3)", result.slang)}
    </div>
  `;
}

function buildPart3Html(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 3</span><span class="badge topic">${escapeHtml(result.topic)}</span></h3>
      <p><strong>Question:</strong> ${escapeHtml(result.question)}</p>
      ${renderList("Multi-angle Discussion", result.perspectives)}
      <h4>Band 7 Version</h4>
      <p>${escapeHtml(result.band7.join(" "))}</p>
      <h4>Band 8 Version</h4>
      <p>${escapeHtml(result.band8.join(" "))}</p>
      ${renderList("Native-like Discourse Markers", result.markers)}
      ${renderList("Useful Phrases (5)", result.phrases)}
      ${renderList("Collocations (4)", result.collocations)}
      ${renderList("Spoken / Informal Expressions (3)", result.slang)}
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
}

setupTabs();
setupActions();
renderNotebook();
