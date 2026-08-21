# ?? CropGuardian AI

> **"Helping farmers detect crop diseases early before they lose their harvest."**

CropGuardian AI is a mobile-first, presentation-ready agricultural decision-support web application. It combines computer vision leaf diagnostics with a quantified **Crop Risk Score (0–100)** to help farmers detect foliar diseases at initial onset, understand symptom urgency, and take decisive protective action.

---

## ?? The Problem

Global smallholder farmers lose **20% to 40%** of their annual crop yields to preventable fungal, bacterial, and oomycete foliar diseases (such as Early Blight, Late Blight, and Leaf Blast). 

Traditional diagnostics face critical bottlenecks:
1. **Late Detection**: By the time lesions become visibly severe across the field, sporulation is already rampant.
2. **Action Paralysis**: Identifying a disease name alone does not tell the farmer *how urgent* the problem is or *what concrete steps* to take within the next 24 to 48 hours.
3. **Information Fragmentation**: Farmers lack immediate access to verified crop protection advice and government relief schemes.

---

## ?? The Solution

CropGuardian AI delivers a 3-step decision support loop:

$$\text{DETECT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{ACT}$$

1. **DETECT**: The farmer snaps or selects a photo of an affected leaf. The AI inspects lesion morphology, concentric rings, and discoloration patterns.
2. **UNDERSTAND**: The system calculates a transparent **Crop Risk Index (0–100)** combining disease severity and detection confidence, rendered on a glowing semicircular gauge.
3. **ACT**: The farmer receives a clear **Action Window** (e.g., *Within 48 hours*), prioritized treatment steps, long-term prevention guidelines, and direct links to official government schemes (PMFBY insurance, PM-KISAN, Soil Health Card).

---

## ? Key Features

- **?? Multi-Crop Pathology Presets**: Instant 1-click test samples for *Tomato Early Blight*, *Rice Leaf Blast*, *Cotton Leaf Spot*, *Potato Early Blight*, and *Healthy Tomato Foliage*.
- **?? Flexible Input**: Supports file drag-and-drop, desktop file picker, and native mobile camera capture (`capture="environment"`).
- **? Animated Diagnostic Loading Experience**: Polished 4-stage visual analysis pipeline (*Inspecting leaf patterns ? Identifying disease ? Estimating severity ? Preparing action plan*).
- **?? Crop Risk Meter (WOW Feature)**: Animated semicircular SVG gauge categorizing risk into *Healthy (0–30)*, *Monitor (31–60)*, and *Immediate Action (61–100)*.
- **?? Crop Health Snapshot**: Summarizes Risk Score, Severity Level, Recovery Outlook, and Action Window with local browser persistence (`localStorage`) and historical session review.
- **??? Verified Farmer Support Schemes**: Curated official government support portals (PM-KISAN, PMFBY, Soil Health Card, KCC, KVK) with category filtering.
- **?? Privacy-First & Zero Friction**: 100% client-side execution. No logins, no database dependencies, no tracking.
- **?? Dual AI Engine (Demo + Gemini Live)**: Built-in deterministic prototype mode guarantees 100% uptime for hackathon pitches, with optional Gemini 1.5 Flash API key integration.

---

## ??? Technology Stack

- **Frontend**: Pure HTML5 (Semantic, Accessible, ARIA compliant)
- **Styling**: Modern Vanilla CSS3
  - Custom dark agricultural color scheme (Deep Forest Green, Lime, Emerald)
  - Glassmorphism (`backdrop-filter: blur(20px)`)
  - CSS Keyframe animations (Laser scan line, pulsing glowing buttons, smooth tweens)
  - Fully responsive Grid and Flexbox layouts (Mobile, Tablet, Desktop)
- **Scripting**: Modular Vanilla JavaScript (ES6+)
  - `upload.js`: Upload, camera capture, file validation, and vector preset generators.
  - `ai.js`: Multimodal Gemini API integration with automatic deterministic fallback.
  - `riskMeter.js`: Risk score calculation algorithm and animated SVG gauge renderer.
  - `schemes.js`: Government support scheme loader and category filter.
  - `app.js`: Master application coordinator and state manager.
- **Zero Heavy Frameworks**: No React/Angular overhead, no npm build step required. Runs directly in any browser.
---

## ?? How to Run Locally

Because CropGuardian AI uses pure native web standards and local JSON assets, it requires zero build steps or package installations.

### Option 1: Python Built-in HTTP Server (Recommended)
```bash
# Navigate to the project root
cd CropGuardian-AI

# Start local server
python -m http.server 8000
```
Open **`http://localhost:8000`** in your browser.

### Option 2: VS Code Live Server
1. Open the `CropGuardian-AI` folder in VS Code.
2. Click **"Go Live"** in the bottom status bar (or right-click `index.html` ? *Open with Live Server*).

---

## ?? 60-Second Hackathon Demo Flow

Use this exact timing sequence during your live presentation:

- **0:00 – 0:10**: *Opening Hook*
  > "Farmers often detect crop diseases too late. By the time symptoms are severe across a field, harvest losses reach 40%. Meet CropGuardian AI."
  > *(Click "Scan My Crop" — smooth scroll down).*

- **0:10 – 0:25**: *Instant Selection & Scan*
  > "A farmer selects or snaps a photo of an affected leaf — like this Tomato Early Blight sample. Notice the preview with laser pattern inspection. Now click 'Analyze Crop'."
  > *(Click "Analyze Crop" — show the 4-stage loading animation).*

- **0:25 – 0:40**: *The AI Diagnosis & WOW Risk Meter*
  > "Within 2 seconds, our AI detects the pathogen: Alternaria solani at 94% confidence. But we don't stop at just naming the disease. Look at our Crop Risk Meter: an indicative score of 78/100, flagged as Immediate Action."
  > *(Point to the glowing gauge needle and 'HIGH RISK' status badge).*

- **0:40 – 0:52**: *Actionable Guidance*
  > "CropGuardian gives the farmer an Action Window — within 48 hours — along with prioritized leaf pruning, protective organic spray advice, and long-term crop rotation tips."
  > *(Click "Save Crop Snapshot" — show 'Saved ?' badge).*

- **0:52 – 1:00**: *Farmer Support & Conclusion*
  > "And if intervention costs are high, the farmer can immediately access government support like PMFBY crop insurance and Soil Health advisory directly from official verified portals. CropGuardian doesn't just identify a possible disease — it empowers farmers to understand the risk and protect their livelihood."

---

## ?? Project Architecture

```
CropGuardian-AI/
¦
+-- index.html               # Main responsive landing page & application interface
+-- README.md                # Hackathon presentation documentation & run guide
+-- .gitignore               # Clean git exclusion rules
¦
+-- css/
¦   +-- style.css            # Dark green glassmorphism theme, layout & components
¦   +-- animations.css       # Keyframe animations (laser scan, pulse glow, transitions)
¦
+-- js/
¦   +-- app.js               # Master controller & application lifecycle coordinator
¦   +-- upload.js            # Drag & drop, camera input, file validation & preset SVGs
¦   +-- ai.js                # Gemini API layer & deterministic fallback engine
¦   +-- riskMeter.js         # Risk calculation formula & semicircular SVG gauge renderer
¦   +-- schemes.js           # Verified government support schemes & category filter
¦
+-- data/
    +-- crops.json           # Supported crop taxonomy & characteristics
    +-- diseases.json        # Disease pathology profiles & severity ranges
    +-- treatments.json      # Treatment recommendations, prevention tips & urgency
    +-- schemes.json         # Official verified government scheme information
```

---

## ?? Future Enhancements

1. **Edge On-Device TensorFlow.js**: Quantized MobileNet model for 100% offline edge inference directly in rural areas without cellular network coverage.
2. **Multilingual Voice Assistance**: Speech-to-text input and local regional voice prompts in Hindi, Telugu, Tamil, Marathi, Punjabi, and Bengali.
3. **Agro-Weather Micro-Forecast Integration**: Correlating leaf symptoms with live atmospheric humidity and dew-point data to predict fungal sporulation outbreaks.
4. **Geo-Fenced Community Outbreak Map**: Anonymized pest & blight clustering maps to alert neighboring farms before regional contagion spreads.

---

## ?? Disclaimer

CropGuardian AI is a prototype decision-support tool designed for informational and educational purposes during hackathons. It does not replace professional agronomic inspection, soil laboratory assays, or certified chemical advisory.
