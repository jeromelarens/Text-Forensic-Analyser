const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    contentType: { type: String, required: true },
    label: String,
    score: Number,
    signals: Object,
    explanation: Array,
    factCheck: Object,
    credibilityScore: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analysis", analysisSchema);
