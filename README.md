<div align="center">

# 🕵️ Skeptical AI

### AI-Assisted Forensic Content Analysis & Risk Assessment Platform

*Evidence over assumption. Calibration over exaggeration. Explainability over black-box decisions.*

[![Status](https://img.shields.io/badge/status-final%20academic%20project-brightgreen)](#-final-system-status)
[![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](#-technology-stack)
[![Frontend](https://img.shields.io/badge/frontend-React%20%7C%20Vite%20%7C%20Tailwind-61DAFB?logo=react&logoColor=white)](#-technology-stack)
[![Database](https://img.shields.io/badge/database-MongoDB-47A248?logo=mongodb&logoColor=white)](#-technology-stack)
[![AI Models](https://img.shields.io/badge/AI-DistilBERT%20%7C%20BART--MNLI-orange)](#-machine-learning-models)
[![Tests](https://img.shields.io/badge/tests-535%2F535%20passed-success)](#-validation-results)
[![License](https://img.shields.io/badge/license-Academic%20Project-lightgrey)](#)

</div>

---

> **⚠️ Important:** Skeptical AI is **not** a certified fact checker, lie detector, or objective truth-verification system. It provides **probabilistic forensic risk assessment** to support human review and investigation.

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Objectives](#-objectives)
- [Core Intelligence Architecture](#-core-intelligence-architecture)
- [Text Intelligence](#-text-intelligence)
- [Machine Learning Models](#-machine-learning-models)
- [Evidence Fusion](#-evidence-fusion)
- [Risk Score vs Confidence](#️-risk-score-vs-confidence)
- [Decision Engine & Explainability](#-decision-engine)
- [Image Forensics & Security](#️-image-forensics)
- [API Security](#-api-security)
- [Multi-Tenant Security](#-authentication--multi-tenant-security)
- [Observability & Reliability](#-observability)
- [Database Architecture](#️-database-architecture)
- [Performance Engineering](#-performance-engineering)
- [Testing & Validation Results](#-validation-results)
- [Frontend](#-frontend)
- [Project Structure](#-high-level-project-structure)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-running-the-project)
- [Environment Configuration](#-environment-configuration)
- [API Overview](#-api-overview)
- [Development Phases](#-project-development-phases)
- [Limitations](#️-limitations)
- [Future Enhancements](#-future-enhancements)
- [Disclaimer](#-disclaimer)

---

## 📌 Project Overview

Online content can contain a mixture of factual information, emotional language, clickbait, urgency, absolutist claims, sensational framing, and manipulated visual material. A simple keyword-based system can easily produce **false positives**.

For example:

> *"The National Weather Service issued a flood warning after heavy rainfall."*

The words `flood` and `warning` may appear suspicious to a naive keyword detector — even though the sentence is legitimate factual reporting.

**Skeptical AI** solves this through a multi-stage intelligence architecture that considers:

| Signal Type | Examples |
|---|---|
| 🗣️ Linguistic | Context, tone, phrasing patterns |
| 😠 Emotional | Intensity, affective polarity |
| 🎣 Rhetorical | Clickbait, urgency, absolutism |
| 🔤 Typography | Caps, punctuation amplifiers |
| 🤖 Neural | ML model outputs |
| 🔗 Cross-signal | Evidence correlation & conflicts |
| 📊 Statistical | Input sufficiency, confidence |

The result is a **calibrated forensic assessment** — never a binary "true/false" claim.

---

## 🎯 Objectives

- Analyze suspicious textual content using multiple independent signals
- Detect rhetorical and linguistic manipulation patterns
- Analyze supported image formats using forensic file inspection
- Prevent extension and MIME spoofing
- Protect the image pipeline from malformed and oversized files
- Combine correlated evidence without double-counting
- Separate `riskScore` from `confidence`
- Detect conflicts between heuristic and ML signals
- Produce explainable forensic findings with exact evidence traceability
- Provide secure multi-user analysis history
- Protect APIs against common attack classes
- Provide bounded ML concurrency and timeout protection
- Provide operational metrics and system health monitoring
- Validate the entire system through deterministic and end-to-end tests

---

## 🧠 Core Intelligence Architecture

```
Input → Validation → Feature Extraction → ML Model Inference
      → Signal Normalization → Evidence Fusion → Conflict Analysis
      → Input Sufficiency → Confidence Calibration → Decision Engine
      → Explainability → Canonical Result
```

---

## 🔍 Text Intelligence

The text analysis engine combines **deterministic forensic heuristics** with **machine-learning signals**.

### Heuristic Signals

<table>
<tr><td width="34%"><b>1. Clickbait & Sensational Framing</b></td><td>Sensational headlines, curiosity hooks, shock framing, hidden/exposed claims, engagement-oriented language</td></tr>
<tr><td><b>2. Emotional & Affective Intensity</b></td><td>Measures high-arousal emotional language. Negative language ≠ deception — contextual calibration prevents legitimate negative subject matter from inflating risk</td></tr>
<tr><td><b>3. Absolutist Cognitive Markers</b></td><td>Terms like <code>everyone</code>, <code>nobody</code>, <code>always</code>, <code>never</code>, <code>unquestionably</code> — indicators of excessive certainty</td></tr>
<tr><td><b>4. Urgency & Psychological Pressure</b></td><td>Phrases like <i>act now</i>, <i>immediately</i>, <i>before it is too late</i>, <i>share this now</i></td></tr>
<tr><td><b>5. Typographical Anomalies</b></td><td>Excessive capitalization, repeated exclamation marks, aggressive headline formatting</td></tr>
</table>

## 🤖 Machine Learning Models

| Model | Role | Notes |
|---|---|---|
| **DistilBERT** | Affective Sentiment Polarity | Contributes sentiment signal only — **not** a misinformation detector. Legitimate negative reporting (e.g. earthquake damage news) is contextually calibrated before affecting risk. |
| **BART-large MNLI** | Zero-Shot Rhetorical Framing | Evaluates semantic alignment against manipulative framing hypotheses — treated as a rhetorical signal, **not** ground-truth verification. |

### 🧩 Signal Normalization

All signals collapse into one canonical structure so heuristic, ML, metadata, structural, and statistical signals can flow through the same downstream pipeline:

```json
{
  "name": "",
  "score": 0,
  "severity": "",
  "evidence": [],
  "reason": "",
  "source": "",
  "contribution": 0,
  "reliability": 0,
  "correlationGroup": ""
}
```

---

## 🔗 Evidence Fusion

Skeptical AI does **not** simply sum every signal. Correlated signals are grouped into evidence clusters:

`LINGUISTIC_CLICKBAIT` · `LINGUISTIC_EMOTION` · `LINGUISTIC_URGENCY` · `LINGUISTIC_ABSOLUTISM` · `ML_SEMANTIC` · `IMAGE_METADATA` · `IMAGE_STATISTICAL` · `IMAGE_VISUAL`

Signals within the same correlation group use a **sub-linear diminishing factor** — preventing *Clickbait + Emotional language + Urgency* from being counted as three independent pieces of evidence when they may represent one underlying rhetorical strategy.

---

## ⚖️ Risk Score vs Confidence

A core architectural decision: **Risk Score ≠ Confidence**

| | Risk Score | Confidence |
|---|---|---|
| **Represents** | Strength of observed forensic risk indicators | Internal evidentiary support & signal consistency |
| **Range** | 0 – 100 | 0 – 100 |
| **Driven by** | Heuristic + ML risk signals | Evidence density, cross-signal agreement, feature coverage, model availability, input sufficiency, conflicts, reliability |

➡️ Both **High Risk + High Confidence** and **High Risk + Low Confidence** are valid, distinct outcomes.

### ⚔️ Conflict Detection

When heuristics report high manipulation indicators but ML framing shows low alignment, the system does **not** inflate the risk score — it **reduces confidence** instead, avoiding the presentation of uncertain evidence as highly certain.

---

## 📊 Decision Engine

Calibrated risk + confidence map to forensic assessment categories:

`Likely Authentic` → `Low Suspicion` → `Moderately Suspicious` → `Strongly Suspicious` → `Highly Suspicious` → `Inconclusive / Low Evidentiary Support`

### 📝 Explainable AI

Every analysis exposes structured explainability: **summary, key findings, supporting evidence, uncertainty, model contribution, limitations, signal rationale.**

```text
Signal:   Clickbait & Sensational Framing
Risk:     66.72%
Evidence: "shocking", "hidden", "exposed"
Reason:   Frequent sensational vocabulary correlates with
          rhetorical engagement priming rather than objective reporting.
```

Evidence is always traceable to the analyzed input — the system does not fabricate evidence snippets.

---

## 🖼️ Image Forensics

**Supported:** `JPEG` `PNG` `WebP`  |  **Rejected:** `GIF` `SVG` `BMP` `TIFF` `PDF` `EXE`

### 🔐 Binary Signature Validation

The backend never trusts filename, extension, or client MIME type — it inspects the **actual binary signature**:

| Format | Magic Bytes |
|---|---|
| JPEG | `FF D8 FF` |
| PNG | `89 50 4E 47 0D 0A 1A 0A` |
| WebP | `RIFF....WEBP` |

### 🛡️ Image Security Pipeline

- **Extension Spoofing Protection** — a real PNG binary saved as `filename.jpg` is rejected
- **Corrupted Image Detection** — malformed/truncated files rejected pre-inference (`IMAGE_DECODE_FAILED`)
- **Dimension Protection** — `MAX_IMAGE_WIDTH = 8192`, `MAX_IMAGE_HEIGHT = 8192`, `MAX_IMAGE_PIXELS = 33,554,432` (a 10,000×10,000 image is rejected before it reaches inference)
- **Cryptographic File Identity** — every image SHA-256 hashed; cache key = `${sha256}:${canonicalFormat}:${ANALYSIS_VERSION}`
- **Temporary File Security** — cryptographically random filenames, guaranteed cleanup across every failure path
- **Image Rate Limiting** — `60 requests / 15 minutes`, exceeding returns `429 RATE_LIMIT_EXCEEDED`

---

## 🔐 API Security

Hardened across the full attack surface (Phase 08):

| Control | Detail |
|---|---|
| **CORS** | Only configured origins accepted; no wildcard credential reflection |
| **JWT** | Restricted to `HS256`; rejects `none`, algorithm confusion, invalid signatures, expired tokens, invalid subjects |
| **Request Limits** | JSON `2 MB` · URL-encoded `1 MB` · Image multipart `10 MB` |
| **HPP Protection** | Guards scalar params (`page`, `limit`, `sortBy`, `sortOrder`, `contentType`, `riskLevel`) against array pollution |
| **NoSQL Injection** | Rejects/sanitizes `$ne`, `$gt`, `$where`, `$regex` |
| **Prototype Pollution** | Protects `__proto__`, `constructor`, `prototype` while preserving legitimate payload content |

---

## 👤 Authentication & Multi-Tenant Security

Analysis records are strictly scoped to the authenticated user — cross-tenant access attempts return `404 RESOURCE_NOT_FOUND` (also reducing ID-enumeration risk).

```
User A                    User B
 ├── Analysis A1           └── Analysis B1
 └── Analysis A2
```

### 📚 Analysis History

Pagination (default `20`, max `100`) · Filtering (`text`, `image`) · Sorting (`createdAt`, `riskScore`, `confidence`, `contentType`) · Safe deletion · Ownership isolation

### 🧾 Audit Logging

Tracks events like `ANALYSIS_CREATED`, `ANALYSIS_DELETED`, `IMAGE_UPLOAD_REJECTED`, `IMAGE_ANALYSIS_COMPLETED` — never logs passwords, JWTs, auth headers, raw image binaries, or sensitive bodies.

---

## 📈 Observability

Centralized metrics: HTTP request rates, status code distribution, latency (`p50` `p95` `p99`), ML inference duration, cache hit/miss ratio, slow queries, model readiness, memory usage — exposed via a sanitized health/metrics endpoint.

## ⚙️ Reliability Engineering

| Feature | Config |
|---|---|
| **Bounded ML Concurrency** | Text: `5` · Image: `3` · Queue max: `20` (else `503 ML_QUEUE_FULL`) |
| **ML Timeout Protection** | Text: `15s` · Image: `20s` (else `504 ML_TIMEOUT`, queue released) |
| **Idempotency** | User-scoped, content-hash based — prevents duplicate inference & cross-tenant leakage |
| **Graceful Shutdown** | Stop new connections → drain in-flight → complete bounded ML work → disconnect DB → terminate (10s grace period) |

---

## 🗄️ Database Architecture

MongoDB-backed. Canonical fields: `analysisId`, `user`, `contentType`, `riskScore`, `confidence`, `riskLevel`, `signals`, `explanation`. Extended fields: `riskBreakdown`, `conflicts`, `inputSufficiency`, `modelContributions`.

---

## 🚀 Performance Engineering

| Metric | Value |
|---|---|
| File write / multipart stream | ~1.46 ms |
| Magic-byte + decode validation | ~0.05 ms |
| SHA-256 hashing | ~0.04 ms |
| Temp file cleanup | ~1.11 ms |
| **Total ingestion overhead (excl. ML)** | **~2.66 ms avg** |
| Cached text analysis | ~0.17 ms avg |
| Cached image analysis | ~0.79 ms avg |
| Cache hit ratio | **96.67%** |

---

## 🧪 Validation Results

| Phase | Result |
|---|---|
| Phase 05.1 | ✅ 32 / 32 PASSED |
| Phase 06 | ✅ 30 / 30 PASSED |
| Phase 07 | ✅ 177 / 177 PASSED (162 deterministic fixtures) |
| Phase 08 | ✅ 49 / 49 PASSED |
| Phase 09 | ✅ 73 / 73 PASSED |
| Phase 10.3 | ✅ 154 / 154 PASSED |
| Static Security Scan | ✅ 51 / 51 files clean |
| Syntax Verification | ✅ 51 / 51 backend files passed |
| Frontend Build (`npm run build`) | ✅ PASS |

Testing covers: functional correctness, API contracts, security, authentication, multi-tenancy, image security, evidence traceability, risk/confidence boundaries, signal normalization, evidence fusion, conflict detection, input sufficiency, concurrency, timeout handling, caching, audit logging, frontend compatibility, and production build validation.

---

## 🎨 Frontend

Built with **React** + **Tailwind CSS**.

```
Authentication → Dashboard → Text/Image Analysis → Results
    → Explainable Evidence → Analysis History
```

Provides risk & confidence visualization, signal breakdown, evidence verification, explainability, history with pagination/deletion, and error handling. Underwent a dedicated UI/UX audit and targeted polish phase — no unnecessary visual redesign introduced.

---

## 📂 High-Level Project Structure

```
Skeptical-AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.js
│   └── tests/
│       ├── fixtures/
│       ├── run_phase5_1_validation.js
│       ├── run_phase6_validation.js
│       ├── run_phase7_validation.js
│       ├── run_phase8_security_validation.js
│       ├── run_phase9_system_acceptance.js
│       ├── run_phase10_3_calibration.js
│       ├── check_syntax.js
│       └── run_static_security_scan.js
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       └── ...
│
├── docs/
│   ├── PHASE-03.1-*
│   ├── PHASE-03.2-*
│   ├── PHASE-04-*
│   ├── PHASE-05.1-*
│   ├── PHASE-06-*
│   ├── PHASE-07-*
│   ├── PHASE-08-*
│   ├── PHASE-09-*
│   └── PHASE-10.3-*
│
└── README.md
```

---

## 🧰 Technology Stack

<table>
<tr>
<td valign="top" width="20%">

**Frontend**
- React
- JavaScript
- Tailwind CSS
- Vite

</td>
<td valign="top" width="20%">

**Backend**
- Node.js
- Express.js

</td>
<td valign="top" width="20%">

**Database**
- MongoDB

</td>
<td valign="top" width="20%">

**AI / ML**
- DistilBERT
- BART-large MNLI

</td>
<td valign="top" width="20%">

**Security**
- JWT · Helmet · CORS
- Rate Limiting · HPP
- NoSQL Injection Guard
- Prototype Pollution Guard
- Magic-Byte Validation
- SHA-256

</td>
</tr>
</table>

**Dev & Testing:** Git · GitHub · Postman · Node.js · Vite

---

## 🧪 Running the Project

### Backend

```bash
cd backend
npm install
npm run dev
# or: npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server typically starts at **http://localhost:5173**

---

## 🔐 Environment Configuration

Create a `.env` file in `backend/` following this schema:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

> ⚠️ **Never commit** `.env`, JWT secrets, database credentials, API keys, or other private credentials.

---

## 📡 API Overview

```
/api/auth
/api/analysis
/api/history
/api/image
/api/health
```

**Health endpoints:**

```
GET /api/health/live
GET /api/health/ready
GET /api/health/metrics
```

> Verify exact routes against the current backend route registration before publishing external documentation.

### 📋 Canonical Analysis Result

```json
{
  "success": true,
  "data": {
    "analysisId": "....",
    "contentType": "text",
    "riskScore": 32.5,
    "confidence": 71,
    "riskLevel": "medium",
    "signals": [],
    "explanation": {}
  }
}
```

Extended fields may include `riskBreakdown`, `conflicts`, `inputSufficiency`, `modelContributions`. All numeric risk/confidence values are bounded `0 ≤ value ≤ 100`.

---

## 📚 Project Development Phases

| Phase | Focus | Status |
|---|---|---|
| 01 | Core Architecture & Foundation | ✅ Complete |
| 02 | Authentication & Identity | ✅ Complete |
| 03 | Text & Image Intelligence Foundation | ✅ Complete |
| 03.1 | Accuracy, Calibration & Reliability | ✅ Complete |
| 03.2 | Intelligence Quality & Evaluation Hardening | ✅ Complete |
| 04 | Analysis History & Data Integrity | ✅ Complete |
| 05 | File/Image Security | ✅ Complete |
| 05.1 | Security Verification & Performance Reconciliation | ✅ Complete |
| 06 | Observability, Reliability & Performance | ✅ Complete |
| 07 | AI Intelligence & Decision Engine | ✅ Complete |
| 08 | Production API Security | ✅ Complete |
| 09 | Master System Acceptance | ✅ Complete |
| 10.1 | Frontend UI/UX Audit | ✅ Complete |
| 10.2 | Frontend UI/UX Polish | ✅ Complete |
| 10.3 | Intelligence Calibration & Correction | ✅ Complete |

---

## 🎓 Academic Positioning

Skeptical AI is designed as an **academic final-year engineering project** demonstrating the integration of:

Artificial Intelligence · Natural Language Processing · Computer Vision / Image Forensics · Web Application Architecture · Cybersecurity · Database Engineering · Software Testing · Observability · Reliability Engineering · Explainable AI

The project emphasizes **engineering defensibility** rather than unsupported claims of perfect AI accuracy.

---

## ⚠️ Limitations

1. **No Ground-Truth Fact Verification** — the system cannot independently determine objective factual truth.
2. **ML Model Limitations** — DistilBERT and BART-large MNLI are supporting signals, not authoritative sources.
3. **Heuristic Calibration** — thresholds are engineering parameters; rigorous empirical evaluation would need a domain-specific ground-truth dataset (Precision, Recall, F1, ROC-AUC, Calibration Error).
4. **Image Forensics** — no detector guarantees detection of every sophisticated manipulation technique.
5. **Supported Image Formats** — intentionally limited to JPEG, PNG, WebP.

---

## 🔮 Future Enhancements

- Domain-specific labeled datasets
- Human analyst feedback loops
- Advanced multimodal models
- More robust image manipulation detectors
- Model experiment tracking
- Statistical calibration against ground-truth datasets
- Additional accessibility testing
- Advanced forensic visualization

---

## 🏆 Final System Status

<div align="center">

| Component | Status |
|---|---|
| Backend | ✅ Validated |
| Frontend | ✅ Validated |
| Security | ✅ Validated |
| AI Intelligence | ✅ Validated |
| Image Forensics | ✅ Validated |
| Observability | ✅ Validated |
| Multi-Tenant Isolation | ✅ Validated |
| End-to-End Acceptance | ✅ **PASSED** |

### 🟢 FINAL ACADEMIC PROJECT READY

</div>

---

## 📜 Disclaimer

Skeptical AI provides **AI-assisted forensic analysis and risk assessment**. It does **not** provide certified fact verification, legal conclusions, medical conclusions, certified lie detection, or guaranteed identification of manipulated content.

All results should be interpreted as **probabilistic analytical signals** and reviewed by a qualified human when consequential decisions are involved.

---

## 👨‍💻 Project Documentation

Detailed technical documentation is available under [`/docs`](./docs):

`PHASE-03.1-AUDIT.md` · `PHASE-03.1-CALIBRATION.md` · `PHASE-03.2-AUDIT.md` · `PHASE-03.2-EVALUATION.md` · `PHASE-04-ARCHITECTURE.md` · `PHASE-04-DATA-INTEGRITY.md` · `PHASE-04-SECURITY-TEST.md` · `PHASE-05.1-PERFORMANCE.md` · `PHASE-06-*` · `PHASE-07-*` · `PHASE-08-*` · `PHASE-09-*` · `PHASE-10.3-*`

---

<div align="center">

## ⭐ Project Philosophy

**Don't claim certainty when the evidence only supports probability.**

Evidence over assumption &nbsp;•&nbsp; Calibration over exaggeration &nbsp;•&nbsp; Explainability over black-box decisions

</div>
