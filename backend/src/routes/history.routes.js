const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Analysis = require("../models/analysis.model");

router.get("/", auth, async (req, res, next) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
