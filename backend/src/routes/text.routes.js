const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Analysis = require("../models/analysis.model");
const { analyzeText } = require("../services/text.service");

router.post("/analyze", auth, async (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = await analyzeText(req.body.text);

    const record = await Analysis.create({
      contentType: "text",
      label: result.verdict,
      score: result.confidence,
      signals: result.signals,
      explanation: result.explanation,
      user: req.user.id
    });

    res.json(record);

  } catch (err) {
    next(err);
  }
});

module.exports = router;