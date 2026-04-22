const storageKey = "ielts-speaking-notebook";

const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

const topicKeywords = {
  Education: ["school", "study", "learn", "university", "teacher", "education"],
  Technology: ["technology", "phone", "app", "internet", "online", "computer"],
  Environment: ["environment", "climate", "pollution", "recycle", "green", "nature"],
  Travel: ["travel", "trip", "journey", "holiday", "tour", "visit"],
  Work: ["job", "work", "career", "office", "salary", "boss"],
  Health: ["health", "exercise", "diet", "sleep", "mental", "fitness"],
};

const speakingToolkit = {
  fillers: ["Well,", "Honestly,", "To be fair,", "I mean,", "You know,"],
  phrases: [
    "to be honest",
    "at the end of the day",
    "I’d say it depends",
    "one thing I’ve noticed",
    "it makes a huge difference",
    "I’m really into",
  ],
  collocations: [
    "heavy workload",
    "make progress",
    "daily routine",
    "strong impression",
    "social pressure",
    "time management",
  ],
  slang: ["kind of", "super handy", "a game-changer", "not my thing", "pretty chill"],
  discourse: [
    "From my point of view,",
    "On the other hand,",
    "From a broader perspective,",
    "That said,",
  ],
};

function switchTab(targetId) {
  tabs.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === targetId));
  panels.forEach((panel) => panel.classList.toggle("active", panel.id === targetId));
}

tabs.forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function detectTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, words] of Object.entries(topicKeywords)) {
    if (words.some((word) => lower.includes(word))) return topic;
  }
  return "General";
}

function pickRandom(list, count) {
  return [...list].sort(() => Math.random() - 0.5).slice(0, count);
}

function createList(items, title) {
  return `
    <h4>${title}</h4>
    <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
  `;
}

function nowISO() {
  return new Date().toISOString();
}

function loadNotebook() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveNotebook(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
}

function appendNotebook(entry) {
  const items = loadNotebook();
  items.unshift(entry);
  saveNotebook(items);
  renderNotebook();
}

function baseLanguagePack() {
  return {
    phrases: pickRandom(speakingToolkit.phrases, 5),
    collocations: pickRandom(speakingToolkit.collocations, 4),
    slang: pickRandom(speakingToolkit.slang, 3),
  };
}

function generatePart1(question) {
  const opener = pickRandom(speakingToolkit.fillers, 1)[0];
  const naturalAnswer = `${opener} I’d say yes, mostly. In my daily life, ${question
    .replace("?", "")
    .toLowerCase()} comes up quite often, so I try to keep it simple and consistent. It’s not perfect every day, but it works for me.`;

  const expansion = [
    "Give one quick personal example from this week.",
    "Add a contrast: what you liked before vs now.",
    "Mention one challenge and how you deal with it.",
  ];

  return {
    answer: naturalAnswer,
    ...baseLanguagePack(),
    expansion,
  };
}

function generatePart2(cueCard) {
  const topic = detectTopic(cueCard);
  const commonStory = `I’m going to talk about ${cueCard
    .replace("Describe", "a time when I")
    .replace("?", "")}. The first time was a bit unexpected, but it left a strong impression on me.`;

  const band7 = `${commonStory} I remember the main details clearly: where it happened, who was there, and why it mattered. I kept things simple, stayed calm, and just focused on enjoying the moment. Looking back, it was meaningful because it taught me to appreciate small experiences instead of overthinking everything.`;

  const band8 = `${commonStory} What made it special was the mix of emotions at the time—part excitement, part uncertainty. As the situation developed, I became more aware of the little details, like the atmosphere and people’s reactions. In hindsight, it was a real turning point because it changed how I approach similar situations now: with more confidence, flexibility, and gratitude.`;

  return {
    topic,
    band7,
    band8,
    links: [
      "To start with",
      "What stands out most is...",
      "The thing is...",
      "Looking back,",
      "All in all,",
    ],
    vocabBank: pickRandom(
      [
        "memorable occasion",
        "vivid detail",
        "mixed feelings",
        "turning point",
        "sense of achievement",
        "keep the momentum",
      ],
      6,
    ),
    ...baseLanguagePack(),
  };
}

function generatePart3(question) {
  const topic = detectTopic(question);
  const p1 = "Well, it really depends on the context.";
  const p2 = "From a broader perspective, there are both benefits and trade-offs.";

  const band7 = `${p1} On one side, ${topic.toLowerCase()} can improve people’s lives in practical ways, especially when access and cost are reasonable. On the other side, there can be pressure, inequality, or unintended effects, so I think balance is key.`;

  const band8 = `${p1} ${p2} If we look at individuals, the impact is often immediate and personal, like convenience or better opportunities. However, at a social level, the same trend may widen gaps between different groups. That’s why I’d argue for smart policies and personal responsibility at the same time.`;

  return {
    topic,
    perspectives: ["Individual-level impact", "Society-level impact"],
    band7,
    band8,
    markers: pickRandom(speakingToolkit.discourse, 4),
    ...baseLanguagePack(),
  };
}

function renderPart1Output(result) {
  return `
    <div class="card">
      <h3>Natural Short Answer</h3>
      <p>${result.answer}</p>
      ${createList(result.phrases, "Useful Phrases (5)")}
      ${createList(result.collocations, "Collocations (4)")}
      ${createList(result.slang, "Spoken / Informal Expressions (3)")}
      ${createList(result.expansion, "Optional Follow-up Ideas")}
    </div>
  `;
}

function renderPart2Output(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 2</span><span class="badge topic">${result.topic}</span></h3>
      <h4>Band 7 Sample</h4>
      <p>${result.band7}</p>
      <h4>Band 8 Sample</h4>
      <p>${result.band8}</p>
      ${createList(result.links, "Fluency Linking Phrases")}
      ${createList(result.vocabBank, "Topic Vocabulary Bank")}
      ${createList(result.phrases, "Useful Phrases (5)")}
      ${createList(result.collocations, "Collocations (4)")}
      ${createList(result.slang, "Spoken / Informal Expressions (3)")}
    </div>
  `;
}

function renderPart3Output(result) {
  return `
    <div class="card">
      <h3><span class="badge part">Part 3</span><span class="badge topic">${result.topic}</span></h3>
      ${createList(result.perspectives, "Multi-Angle Discussion")}
      <h4>Band 7 Version</h4>
      <p>${result.band7}</p>
      <h4>Band 8 Version</h4>
      <p>${result.band8}</p>
      ${createList(result.markers, "Native-like Discourse Markers")}
      ${createList(result.phrases, "Useful Phrases (5)")}
      ${createList(result.collocations, "Collocations (4)")}
      ${createList(result.slang, "Spoken / Informal Expressions (3)")}
    </div>
  `;
}

function saveGenerated(part, input, result, htmlPreview) {
  const entry = {
    id: crypto.randomUUID(),
    part,
    topic: detectTopic(input),
    input,
    result,
    htmlPreview,
    createdAt: nowISO(),
  };
  appendNotebook(entry);
}

function renderNotebook() {
  const search = document.querySelector("#search-input").value.trim().toLowerCase();
  const filter = document.querySelector("#filter-part").value;

  const container = document.querySelector("#notebook-output");
  const items = loadNotebook().filter((entry) => {
    const byPart = filter === "all" || String(entry.part) === filter;
    const blob = `${entry.input} ${JSON.stringify(entry.result)}`.toLowerCase();
    const bySearch = !search || blob.includes(search);
    return byPart && bySearch;
  });

  if (items.length === 0) {
    container.innerHTML = "<p class='meta'>No notebook items match your filter.</p>";
    return;
  }

  container.innerHTML = items
    .map(
      (entry) => `
      <div class="card">
        <div>
          <span class="badge part">Part ${entry.part}</span>
          <span class="badge topic">${entry.topic}</span>
        </div>
        <p class="meta">Saved: ${new Date(entry.createdAt).toLocaleString()}</p>
        <p><strong>Question / Prompt:</strong> ${entry.input}</p>
        <details>
          <summary>Reuse expressions and answer content</summary>
          ${entry.htmlPreview}
        </details>
      </div>
    `,
    )
    .join("");
}

function bindGenerateButtons() {
  document.querySelector("#part1-generate").addEventListener("click", () => {
    const input = document.querySelector("#part1-input").value.trim();
    if (!input) return;

    const result = generatePart1(input);
    const html = renderPart1Output(result);
    document.querySelector("#part1-output").innerHTML = html;
    saveGenerated(1, input, result, html);
  });

  document.querySelector("#part2-generate").addEventListener("click", () => {
    const input = document.querySelector("#part2-input").value.trim();
    if (!input) return;

    const result = generatePart2(input);
    const html = renderPart2Output(result);
    document.querySelector("#part2-output").innerHTML = html;
    saveGenerated(2, input, result, html);
  });

  document.querySelector("#part3-generate").addEventListener("click", () => {
    const input = document.querySelector("#part3-input").value.trim();
    if (!input) return;

    const result = generatePart3(input);
    const html = renderPart3Output(result);
    document.querySelector("#part3-output").innerHTML = html;
    saveGenerated(3, input, result, html);
  });
}

function bindNotebookControls() {
  document.querySelector("#search-input").addEventListener("input", renderNotebook);
  document.querySelector("#filter-part").addEventListener("change", renderNotebook);
  document.querySelector("#clear-notebook").addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    renderNotebook();
  });
}

bindGenerateButtons();
bindNotebookControls();
renderNotebook();
