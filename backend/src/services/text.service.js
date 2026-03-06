const { pipeline } = require("@xenova/transformers");

let classifier = null;
let zeroShotClassifier = null;
let nerPipeline = null;
let loadingPromise = null;

/* ===============================
   LOAD MODELS (SAFE LOCK)
================================ */
async function loadTextModel() {
  if (classifier && zeroShotClassifier && nerPipeline) return;

  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    classifier = await pipeline(
      "text-classification",
      "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
      { quantized: true }
    );

    zeroShotClassifier = await pipeline(
      "zero-shot-classification",
      "Xenova/bart-large-mnli",
      { quantized: true }
    );

    nerPipeline = await pipeline(
      "ner",
      "Xenova/bert-base-NER",
      { quantized: true }
    );

    console.log("✅ Models Loaded Successfully");
  })();

  await loadingPromise;
  loadingPromise = null;
}

/* ===============================
   HELPERS
================================ */
function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

/* ===============================
   SIMPLE SIGNAL DETECTORS
================================ */
function keywordScore(text, words, weight) {
  const clean = text
    .toLowerCase()
    .replace(/[^\w\s%]/g, "")
    .split(/\s+/);

  let count = 0;

  words.forEach(w => {
    clean.forEach(token => {
      if (token === w) count++;
    });
  });

  return clamp(count * weight);
}

function clickbaitScore(text) {
  return keywordScore(text, [
    "shocking","breaking","secret","exposed",
    "undeniable","conspiracy","urgent","warning"
  ], 0.15);
}

function emotionalScore(text) {
  return keywordScore(text, [
    "corrupt","evil","fraud","dangerous",
    "terrifying","disaster","scandal","outrageous"
  ], 0.18);
}

function absolutistScore(text) {
  return keywordScore(text, [
    "always","never","everyone","nobody",
    "100%","guaranteed","proven","undeniable"
  ], 0.2);
}

/* ===============================
   SAFE ML EXECUTION
================================ */
async function mlScore(text) {
  try {
    if (!classifier || !zeroShotClassifier) {
      return { sentiment: 0.5, propaganda: 0.5, toxicity: 0.5 };
    }

    const trimmed = text.slice(0, 512); // reduced size

    const labels = [
      "propaganda",
      "misinformation",
      "factual news",
      "opinion",
      "satire"
    ];

    const results = await Promise.allSettled([
      classifier(trimmed),
      zeroShotClassifier(trimmed, labels),
      nerPipeline ? nerPipeline(trimmed) : Promise.resolve([])
    ]);

    // Sentiment
    let sentiment = 0.5;
    if (results[0].status === "fulfilled") {
      const raw = results[0].value[0];
      const s = raw.label === "NEGATIVE"
        ? raw.score
        : 1 - raw.score;
      sentiment = Math.abs(s - 0.5) * 2;
    }

    // Propaganda
    let propaganda = 0.5;
    if (results[1].status === "fulfilled") {
      const scores = {};
      results[1].value.labels.forEach((l, i) => {
        scores[l] = results[1].value.scores[i];
      });

      propaganda = Math.max(
        scores["propaganda"] || 0,
        scores["misinformation"] || 0
      );
    }

    // NER Toxicity
    let toxicity = 0;
    if (results[2].status === "fulfilled") {
      const persons = results[2].value.filter(e =>
        e.entity.includes("PER")
      );
      toxicity = clamp(persons.length * 0.04);
    }

    return {
      sentiment: clamp(sentiment),
      propaganda: clamp(propaganda),
      toxicity: clamp(toxicity)
    };

  } catch (err) {
    console.error("ML Safe Error:", err);
    return { sentiment: 0.5, propaganda: 0.5, toxicity: 0.5 };
  }
}

/* ===============================
   FUSION ENGINE
================================ */
function fuseScores(scores) {
  const weights = {
    clickbait: 0.2,
    emotional: 0.2,
    absolutist: 0.2,
    mlSentiment: 0.15,
    mlPropaganda: 0.2,
    mlToxicity: 0.05
  };

  let base =
    scores.clickbait * weights.clickbait +
    scores.emotional * weights.emotional +
    scores.absolutist * weights.absolutist +
    scores.ml.sentiment * weights.mlSentiment +
    scores.ml.propaganda * weights.mlPropaganda +
    scores.ml.toxicity * weights.mlToxicity;

  // Signal boost
  if (scores.clickbait > 0.7) base += 0.05;
  if (scores.emotional > 0.7) base += 0.05;
  if (scores.absolutist > 0.7) base += 0.05;
  if (scores.ml.propaganda > 0.6) base += 0.07;

  base = Math.min(base, 0.9);

  return clamp(Math.pow(base, 0.8));
}

/* ===============================
   MAIN ANALYZE FUNCTION
================================ */
async function analyzeText(text) {
  if (!text || text.trim().length < 15) {
    throw new Error("Text too short");
  }

  await loadTextModel();

  const [
    clickbait,
    emotional,
    absolutist,
    ml
  ] = await Promise.all([
    Promise.resolve(clickbaitScore(text)),
    Promise.resolve(emotionalScore(text)),
    Promise.resolve(absolutistScore(text)),
    mlScore(text)
  ]);

  const fused = fuseScores({
    clickbait,
    emotional,
    absolutist,
    ml
  });

  const confidence = Number((fused * 100).toFixed(2));

  return {
    verdict:
      confidence >= 85 ? "Highly Manipulative" :
      confidence >= 70 ? "Strongly Suspicious" :
      confidence >= 55 ? "Moderately Suspicious" :
      confidence >= 40 ? "Mildly Suspicious" :
      confidence >= 25 ? "Likely Authentic" :
      "Authentic",
    confidence,
    riskLevel:
      fused > 0.7 ? "high" :
      fused > 0.4 ? "medium" :
      "low",
    signals: {
      clickbaitLevel: Number((clickbait * 100).toFixed(2)),
      emotionalIntensity: Number((emotional * 100).toFixed(2)),
      absolutistLanguage: Number((absolutist * 100).toFixed(2)),
      mlSentiment: Number((ml.sentiment * 100).toFixed(2)),
      mlPropaganda: Number((ml.propaganda * 100).toFixed(2)),
      mlToxicity: Number((ml.toxicity * 100).toFixed(2))
    },
    metadata: {
      textLength: text.length,
      analyzedAt: new Date().toISOString(),
      modelVersion: "5.0-stable"
    }
  };
}

module.exports = {
  loadTextModel,
  analyzeText
};