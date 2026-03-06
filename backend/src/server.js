const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");

dotenv.config();

const connectDB = require("./config/db");

const { loadTextModel } = require("./services/text.service");
const { loadImageModel } = require("./services/image.service");

const textRoutes = require("./routes/text.routes");
const imageRoutes = require("./routes/image.routes");
const videoRoutes = require("./routes/video.routes");
const authRoutes = require("./routes/auth.routes");
const historyRoutes = require("./routes/history.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===============================
   GLOBAL ERROR LOGGING
================================ */
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

/* ===============================
   SECURITY
================================ */
app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* ===============================
   HEALTH CHECK
================================ */
app.get("/api/health", (req, res) => {
  res.json({ status: "Server running properly" });
});

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/text", textRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/video", videoRoutes);

/* ===============================
   ERROR HANDLER
================================ */
app.use(errorMiddleware);

/* ===============================
   START SERVER (SAFE MODE)
================================ */
const startServer = async () => {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Database connected");

    console.log("Loading models...");

    try {
      await loadTextModel();
      console.log("Text model loaded");
    } catch (err) {
      console.error("Text model failed:", err.message);
    }

    try {
      await loadImageModel();
      console.log("Image model loaded");
    } catch (err) {
      console.error("Image model failed:", err.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Critical startup error:", err);
    process.exit(1);
  }
};

startServer();