const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static").path;
const path = require("path");
const fs = require("fs");
const { analyzeImage } = require("./image.service");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const FRAMES_DIR = path.join(__dirname, "../../frames");

if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR);
}

function clearFrames() {
  const files = fs.readdirSync(FRAMES_DIR);
  files.forEach(file =>
    fs.unlinkSync(path.join(FRAMES_DIR, file))
  );
}

function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
}

async function extractFrames(videoPath) {
  clearFrames();

  const duration = await getVideoDuration(videoPath);

  const interval = duration > 10 ? duration / 10 : 1;

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(path.join(FRAMES_DIR, "frame-%03d.jpg"))
      .outputOptions([`-vf fps=1/${interval}`])
      .on("end", () => {
        const frames = fs.readdirSync(FRAMES_DIR)
          .map(f => path.join(FRAMES_DIR, f));

        resolve(frames);
      })
      .on("error", reject)
      .run();
  });
}

function buildVerdict(score) {
  if (score > 75) return "Likely Manipulated";
  if (score > 50) return "Suspicious";
  return "Likely Authentic";
}

async function analyzeVideo(videoPath) {
  const frames = await extractFrames(videoPath);

  if (!frames.length) {
    throw new Error("No frames extracted");
  }

  let total = 0;

  for (const frame of frames) {
    const result = await analyzeImage(frame);
    total += result.confidence;
  }

  const avgScore = Number((total / frames.length).toFixed(2));

  clearFrames();

  return {
    confidence: avgScore,
    verdict: buildVerdict(avgScore)
  };
}

module.exports = { analyzeVideo };
