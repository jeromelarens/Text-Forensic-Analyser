const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const Analysis = require("../models/analysis.model");
const { analyzeImage } = require("../services/image.service");
const fs = require("fs");

router.post(
  "/analyze",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    let filePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image required" });
      }

      filePath = req.file.path;

      // Run AI analysis
      const result = await analyzeImage(filePath);

      // Save only minimal summary in DB
      await Analysis.create({
        contentType: "image",
        label: result.verdict,
        score: result.confidence,
        user: req.user.id
      });

      // Safe delete uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Return FULL AI result to frontend
      return res.status(200).json(result);

    } catch (err) {

      // Ensure file cleanup even if analysis fails
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      console.error("Image analyze route error:", err);
      return res.status(500).json({
        error: "Image analysis failed",
        details: err.message
      });
    }
  }
);

module.exports = router;