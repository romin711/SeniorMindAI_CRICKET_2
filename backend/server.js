const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const MODEL_FALLBACKS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

function buildModelCandidates() {
  const seen = new Set();
  return [GEMINI_MODEL, ...MODEL_FALLBACKS].filter((modelName) => {
    if (!modelName || seen.has(modelName)) return false;
    seen.add(modelName);
    return true;
  });
}

async function generateWithModelFallback(prompt) {
  const attempted = [];

  for (const modelName of buildModelCandidates()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return {
        text: result.response.text(),
        modelUsed: modelName,
      };
    } catch (err) {
      attempted.push({ modelName, message: err?.message || String(err) });
    }
  }

  const error = new Error("Gemini generation failed for all candidate models.");
  error.attempted = attempted;
  throw error;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt({ query, mode, scale, userArchitecture }) {
  const scaleContext = {
    startup: "a startup with < 10K users, limited budget, small team, fast iteration needed",
    medium: "a medium-scale product with 10K–100K users, growing team, some tech debt allowed",
    large: "a large-scale system with 1M+ users, high availability required, distributed architecture needed",
  }[scale];

  const modeInstruction =
    mode === "junior"
      ? `
You are explaining this to a junior engineer.
- Use simple language
- Avoid deep jargon
- Use analogies where helpful
- Keep architecture simple
- Focus on "what" and "how", not deep "why"
`
      : `
You are a Staff/Principal Engineer conducting a technical deep-dive.
- Think like a senior engineer who has dealt with production failures
- Always mention real-world trade-offs (latency vs consistency, cost vs complexity)
- Include scalability considerations
- Mention what BREAKS at scale and why
- Reference real tools/patterns (Kafka, Redis, CDN, sharding, CQRS, etc.) only when appropriate
- Be opinionated and direct — no vague answers
- Critique naive approaches before recommending
`;

  const critiqueSection = userArchitecture
    ? `
─── USER'S ARCHITECTURE TO CRITIQUE ───
${userArchitecture}

Analyze this architecture with the following lens:
1. What are the critical flaws?
2. What fails first at ${scale} scale?
3. What are the security/reliability gaps?
4. How would you redesign it for ${scaleContext}?
`
    : "";

  return `
You are SeniorMind AI — a Staff-level backend engineer simulator.
You do NOT give generic chatbot answers. You reason like a senior engineer.

CONTEXT:
- Scale: ${scaleContext}
- Mode: ${mode === "junior" ? "Junior (Simple Explanation)" : "Senior (Deep Technical Reasoning)"}

${modeInstruction}

${critiqueSection}

─── USER QUERY ───
${query}

─── STRICT RESPONSE FORMAT ───
You MUST respond using EXACTLY this structure. No deviations.

## 🔍 Problem Breakdown
[2–3 sentences: reframe the problem as an engineer would. Identify hidden complexity.]

## 🛠 Possible Approaches
### Approach 1: [Name]
[Describe the approach in 3–5 lines]

### Approach 2: [Name]
[Describe the approach in 3–5 lines]

### Approach 3: [Name] (if applicable)
[Describe the approach in 3–5 lines]

## ⚖️ Trade-offs
| | Approach 1 | Approach 2 | Approach 3 |
|---|---|---|---|
| Complexity | | | |
| Cost | | | |
| Scalability | | | |
| Dev Speed | | | |

## ✅ Recommended Solution
[Clear recommendation for ${scaleContext}. Be direct. Explain WHY.]

## 🏗 High-Level Architecture
\`\`\`
[ASCII or text-based architecture diagram. Use arrows →, boxes [], labels]
\`\`\`

## ❌ Common Mistakes
- [Mistake 1 with brief explanation]
- [Mistake 2 with brief explanation]
- [Mistake 3 with brief explanation]

## 💡 Senior Insight
[1 sharp, opinionated insight that separates a senior engineer from a junior. Real-world wisdom.]

## 🔗 Follow-up Questions
1. [Follow-up question 1]
2. [Follow-up question 2]
3. [Follow-up question 3]

─── RULES ───
- No fluffy intros or conclusions
- No "Great question!" or filler text
- Always be specific about tools/technologies relevant to ${scale} scale
- If in senior mode, mention at least one failure mode or production gotcha
`.trim();
}

// ─── Route ────────────────────────────────────────────────────────────────────

app.post("/generate", async (req, res) => {
  const { query, mode, scale, userArchitecture } = req.body;

  if (!query || !mode || !scale) {
    return res.status(400).json({ error: "Missing required fields: query, mode, scale" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const prompt = buildPrompt({ query, mode, scale, userArchitecture });

    const { text, modelUsed } = await generateWithModelFallback(prompt);

    res.json({ result: text, modelUsed });
  } catch (err) {
    const attempted = Array.isArray(err.attempted) ? err.attempted : [];
    console.error("Gemini API error:", attempted.length > 0 ? attempted : err.message);
    res.status(500).json({
      error: "Failed to generate response with available Gemini models.",
      details:
        attempted.length > 0
          ? attempted
          : [{ modelName: GEMINI_MODEL, message: err?.message || String(err) }],
    });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ SeniorMind AI backend running on http://localhost:${PORT}`);
});