const { pipeline } = require("@xenova/transformers");

let classifier = null;
let zeroShotClassifier = null;
let loadingPromise = null;

/* ===============================
   LOAD MODELS
================================ */
async function loadTextModel() {

  if (classifier && zeroShotClassifier) return;

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

    console.log("✅ Text models loaded");

  })();

  await loadingPromise;
  loadingPromise = null;
}

/* ===============================
   HELPERS
================================ */

function clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function tokenize(text) {

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

}

/* ===============================
   WORD DETECTION
================================ */

function keywordScore(text, words, weight) {

  const tokens = tokenize(text);
  let count = 0;

  words.forEach(w => {
    tokens.forEach(t => {
      if (t.includes(w)) count++;
    });
  });

  return clamp(count * weight);
}

/* ===============================
   PHRASE DETECTION
================================ */

function phraseScore(text, phrases, weight) {

  const lower = text.toLowerCase();
  let count = 0;

  phrases.forEach(p => {
    if (lower.includes(p)) count++;
  });

  return clamp(count * weight);
}

/* ===============================
   SIGNAL DETECTORS
================================ */

function clickbaitScore(text) {

  return keywordScore(text, [

    "shocking",
    "breaking",
    "secret",
    "exposed",
    "warning",
    "truth",
    "urgent",
    "hidden"

  ], 0.25);

}

function emotionalScore(text) {

  return keywordScore(text, [

    "corrupt",
    "evil",
    "dangerous",
    "collapse",
    "destroy",
    "crisis",
    "fraud",
    "terrifying",
    "disaster"

  ], 0.25);

}

function absolutistScore(text) {

  return keywordScore(text, [

    "always",
    "never",
    "everyone",
    "nobody",
    "guaranteed",
    "proven",
    "undeniable",
    "certain"

  ], 0.25);

}

/* ===============================
   MANIPULATION PHRASES
================================ */

function manipulationPhraseScore(text) {

  return phraseScore(text, [

    "wake up",
    "they are lying",
    "they dont want you to know",
    "they don't want you to know",
    "mainstream media",
    "hidden truth",
    "before it is too late",
    "before it's too late",
    "share this before",
    "final warning",
    "open your eyes",
    "the system is corrupt"

  ], 0.35);

}

/* ===============================
   ML ANALYSIS
================================ */

async function mlScore(text) {

  try {

    if (!classifier || !zeroShotClassifier) {

      return {
        sentiment: 0.5,
        propaganda: 0.5
      };

    }

    const trimmed = text.slice(0, 512);

    const labels = [

      "propaganda",
      "misinformation",
      "factual news",
      "opinion"

    ];

    const [sentimentRaw, zeroShot] = await Promise.all([

      classifier(trimmed),
      zeroShotClassifier(trimmed, labels)

    ]);

    /* SENTIMENT */

    let sentiment = 0.5;

    if (sentimentRaw && sentimentRaw.length) {

      const r = sentimentRaw[0];

      const score = r.label === "NEGATIVE"
        ? r.score
        : 1 - r.score;

      sentiment = Math.abs(score - 0.5) * 2;

    }

    /* PROPAGANDA */

    const scores = {};

    zeroShot.labels.forEach((l, i) => {
      scores[l] = zeroShot.scores[i];
    });

    const propaganda = Math.max(
      scores["propaganda"] || 0,
      scores["misinformation"] || 0
    );

    return {

      sentiment: clamp(sentiment),
      propaganda: clamp(propaganda)

    };

  } catch (err) {

    console.error("ML error:", err);

    return {
      sentiment: 0.5,
      propaganda: 0.5
    };

  }

}

/* ===============================
   FUSION ENGINE
================================ */

function fuseScores(scores) {

  const weights = {

    clickbait: 0.2,
    emotional: 0.2,
    absolutist: 0.15,
    phrase: 0.25,
    mlSentiment: 0.1,
    mlPropaganda: 0.1

  };

  const base =
    scores.clickbait * weights.clickbait +
    scores.emotional * weights.emotional +
    scores.absolutist * weights.absolutist +
    scores.phrase * weights.phrase +
    scores.ml.sentiment * weights.mlSentiment +
    scores.ml.propaganda * weights.mlPropaganda;

  return clamp(base);
}

/* ===============================
   MAIN ANALYZE FUNCTION
================================ */

async function analyzeText(text) {

  if (!text || text.trim().length < 15) {
    throw new Error("Text too short");
  }

  await loadTextModel();

  const clickbait = clickbaitScore(text);
  const emotional = emotionalScore(text);
  const absolutist = absolutistScore(text);
  const phrase = manipulationPhraseScore(text);

  const ml = await mlScore(text);

  const fused = fuseScores({

    clickbait,
    emotional,
    absolutist,
    phrase,
    ml

  });

  const confidence = Number((fused * 100).toFixed(2));

  return {

    verdict:
      confidence >= 80 ? "Highly Manipulative" :
      confidence >= 60 ? "Strongly Suspicious" :
      confidence >= 40 ? "Moderately Suspicious" :
      confidence >= 25 ? "Mildly Suspicious" :
      "Likely Authentic",

    confidence,

    riskLevel:
      fused > 0.7 ? "high" :
      fused > 0.4 ? "medium" :
      "low",

    signals: {

      clickbaitLevel: Number((clickbait * 100).toFixed(2)),
      emotionalIntensity: Number((emotional * 100).toFixed(2)),
      absolutistLanguage: Number((absolutist * 100).toFixed(2)),
      manipulationPhrases: Number((phrase * 100).toFixed(2)),
      mlSentiment: Number((ml.sentiment * 100).toFixed(2)),
      mlPropaganda: Number((ml.propaganda * 100).toFixed(2))

    },

    metadata: {

      textLength: text.length,
      analyzedAt: new Date().toISOString(),
      modelVersion: "6.0-improved"

    }

  };

}

module.exports = {
  loadTextModel,
  analyzeText
};