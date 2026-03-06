const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const Analysis = require("../models/analysis.model");
const { analyzeVideo } = require("../services/video.service");
const fs = require("fs");

router.post(
  "/analyze",
  auth,
  upload.single("video"),
  async (req, res, next) => {
    try {

      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);

      const todayCount = await Analysis.countDocuments({
        user: req.user.id,
        createdAt: { $gte: todayStart }
      });

      if (todayCount >= 20) {
        return res.status(403).json({
          error: "Daily limit reached (20/day)"
        });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Video required" });
      }

      const result = await analyzeVideo(req.file.path);

      const record = await Analysis.create({
        contentType: "video",
        label: result.verdict,
        score: result.confidence,
        user: req.user.id
      });

      fs.unlinkSync(req.file.path);

      res.json(record);

    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
