const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Analysis = require("../models/analysis.model");

router.get("/:id", auth, async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis)
      return res.status(404).json({ error: "Not found" });

    if (analysis.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    res.json({
      verdict: analysis.label,
      score: analysis.score,
      signals: analysis.signals
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
