# Neonatal Sepsis Detection from Cry Audio using Deep Learning

This project detects **neonatal sepsis** from infant cry recordings using a combination of
**audio signal processing**, **classical acoustic feature extraction**, and **deep learning**
(CNN + dense fusion networks). The pipeline progresses through four notebooks —
`phase_1` → `phase_2` → `combo_1` → `combo_2` — moving from raw audio cleanup to a final
multimodal fusion model.

---

## Dataset

- **Classes:** `normal` vs `sepsis` newborn cry recordings (`.wav` files)
- **Raw counts:** 967 Normal samples, 854 Sepsis samples
- **After cleaning/feature extraction:** 1,817 usable samples (a handful of files failed to
  load and were skipped)
- **Sampling rate:** standardized to 16 kHz throughout the pipeline
- **Fixed clip length:** 16,000 samples (1 second per clip)

---

## Pipeline Overview

```
dataset/normal, dataset/sepsis (raw .wav)
        │
        ▼
PHASE 1 — Preprocessing
  • Resample to 16 kHz
  • Trim/pad every clip to exactly 1 second (16,000 samples)
  • Noise reduction (noisereduce)
  • Save to clean/normal, clean/sepsis  →  zipped as clean_dataset.zip
        │
        ▼
PHASE 2 — Exploratory Acoustic Analysis
  • Spectrograms, Mel-spectrograms, MFCCs, Spectral Centroid,
    RMS Energy, Pitch (YIN F0), Tempo/Beats, Zero-Crossing Rate
  • Normal vs Sepsis comparison plots (thesis-grade figures)
        │
        ▼
COMBO 1 — Numerical Feature Ablation
  • Extract 5 acoustic feature groups per clip: MFCC, Centroid, RMS, ZCR, Pitch
  • Try all 31 possible combinations of these 5 groups
  • Train a small Dense neural network on each combination
  • Identify the strongest-performing feature subsets
        │
        ▼
COMBO 2 — CNN + Numerical Feature Fusion Model
  • CNN branch: 128x128 Mel-spectrogram image
  • Feature branch: top-performing numerical feature combos from Combo 1
  • Fuse both branches into a final classifier
  • Evaluate across 3 random train/test splits, report averaged metrics
```

---

## Phase 1 — Audio Preprocessing (`phase_1.ipynb`)

**Goal:** Standardize and clean the raw cry recordings so every downstream notebook works
with consistent, denoised audio.

1. Load each `.wav` file with `librosa` at `SR = 16000`.
2. **Fix length** to `TARGET_LEN = 16000` samples (1 second):
   - Clips longer than 1 second are truncated.
   - Clips shorter than 1 second are zero-padded.
3. **Noise reduction** using `noisereduce.reduce_noise`.
4. Save cleaned clips to `clean/normal` and `clean/sepsis`.
5. Package the cleaned dataset into `clean_dataset.zip` for portability.

---

## Phase 2 — Exploratory Acoustic Analysis (`phase_2.ipynb`)

**Goal:** Visually and quantitatively understand how Normal vs Sepsis cries differ across
several acoustic feature domains, motivating the feature choices used later.

Features explored, each with Normal-vs-Sepsis comparison plots:

| Feature | Description |
|---|---|
| **Spectrogram (STFT)** | Frequency-energy distribution over time |
| **Mel-Spectrogram** | 128-mel band spectrogram, normalized and resized to 128×128 — this becomes the CNN input image in Combo 2 |
| **MFCC** | 16-coefficient Mel-Frequency Cepstral Coefficients, including standardized/Z-scored comparisons |
| **Spectral Centroid** | "Brightness" of the sound — center of mass of the spectrum |
| **RMS Energy** | Loudness/amplitude envelope over time |
| **Pitch (F0)** | Fundamental frequency via the YIN algorithm (`fmin=50Hz`, `fmax=1000Hz`, tuned for infant cry range) |
| **Tempo & Beats** | Beat-tracking applied to cry signal |
| **Zero-Crossing Rate (ZCR)** | Rate of sign changes in the waveform, standardized for comparison |

These visualizations showed measurable differences between Normal and Sepsis cries in
MFCC patterns, pitch range, and energy dynamics — informing which features were carried
forward into the modeling notebooks.

---

## Combo 1 — Numerical Feature Ablation Study (`combo_1.ipynb`)

**Goal:** Systematically determine which combination of numerical acoustic features best
separates Normal vs Sepsis using a simple feed-forward neural network.

### Feature Extraction (`extract_features`)
For each audio clip, five feature groups are computed (mean + std unless noted):

| Group | Description | Dimensionality |
|---|---|---|
| `mfcc` | 16 MFCCs → mean & std across time | 32 |
| `centroid` | Spectral centroid → mean & std | 2 |
| `rms` | RMS energy → mean & std | 2 |
| `zcr` | Zero-crossing rate → mean & std | 2 |
| `pitch` | YIN F0 (NaNs removed) → mean & std | 2 |

Final dataset shapes: `X_mfcc (1817,32)`, `X_centroid/rms/zcr/pitch (1817,2)` each,
`y (1817,)`.

### Combination Search
All **31 combinations** (2⁵ − 1) of the five feature groups are generated via
`itertools.combinations` and concatenated as input vectors.

### Model — `build_numerical_model`
A simple Dense classifier:

```
Input(input_dim)
 → Dense(128, relu) → Dropout(0.3)
 → Dense(64,  relu) → Dropout(0.2)
 → Dense(32,  relu) → Dropout(0.1)
 → Dense(1, sigmoid)
```
Optimizer: Adam (default), Loss: binary cross-entropy, classification threshold = **0.4**.

### Experiments
1. **Single split (random_state=42)** — across all 31 combos, results were saved to
   `numerical_feature_ablation_results.csv`. The top performer was `mfcc + rms`
   (Accuracy 0.9945, Recall 1.0, F1 0.9942, ROC AUC 0.9998).
2. **Robustness check (3 random splits — seeds 42, 357, 999, averaged)** — results saved to
   `numerical_feature_ablation_3x_results.csv`. Top combinations by recall were:

| Features | Accuracy | Precision | Recall | F1 | ROC AUC |
|---|---|---|---|---|---|
| mfcc + rms + zcr | 0.9744 | 0.9655 | 0.9805 | 0.9729 | 0.9971 |
| mfcc + rms + pitch | 0.9762 | 0.9710 | 0.9786 | 0.9748 | 0.9970 |
| mfcc + pitch | 0.9762 | 0.9711 | 0.9786 | 0.9747 | 0.9954 |
| mfcc + centroid + rms + zcr | 0.9744 | 0.9674 | 0.9786 | 0.9729 | 0.9970 |
| mfcc + centroid + pitch | 0.9762 | 0.9730 | 0.9766 | 0.9747 | 0.9958 |

These five **top combos** were carried forward into Combo 2 for fusion with the
image-based CNN branch.

---

## Combo 2 — CNN + Numerical Feature Fusion Model (`combo_2.ipynb`) — **Final Architecture**

**Goal:** Combine spatial information from Mel-spectrogram images with the
hand-engineered acoustic features identified in Combo 1, via a two-branch fusion network.

### Inputs Prepared
- **`X_spec`**: 128×128×1 normalized Mel-spectrogram images, shape `(1817, 128, 128, 1)`.
- **Numerical feature groups**: `mfcc (1817,32)`, `centroid/rms/zcr/pitch (1817,2)` each —
  computed the same way as Combo 1.
- **`top_feature_combos`** carried over from Combo 1's ablation results:
  - `mfcc + rms + zcr`
  - `mfcc + rms + pitch`
  - `mfcc + pitch`
  - `mfcc + centroid + rms + zcr`
  - `mfcc + centroid + pitch`

### Architecture — `build_fusion_model`

**CNN Branch** (processes the 128×128 Mel-spectrogram):
```
Input(128,128,1)
 → Conv2D(32,3x3,relu) → MaxPool(2x2) → Dropout(0.1)
 → Conv2D(64,3x3,relu) → MaxPool(2x2) → Dropout(0.2)
 → Conv2D(128,3x3,relu) → MaxPool(2x2) → Dropout(0.3)
 → GlobalAveragePooling2D
 → Dense(128, relu) → Dropout(0.3)
```

**Feature Branch** (processes the numerical feature combo):
```
Input(feature_dim)
 → Dense(128, relu) → Dropout(0.3)
 → Dense(64, relu)  → Dropout(0.2)
```

**Fusion Head**:
```
Concatenate([CNN branch output, Feature branch output])
 → Dense(128, relu) → Dropout(0.3)
 → Dense(64, relu)  → Dropout(0.2)
 → Dense(1, sigmoid)
```

Optimizer: Adam (lr = 0.0003), Loss: binary cross-entropy, classification threshold = **0.4**.

### Training Protocol
For each of the 5 top feature combos:
- Numerical features are concatenated and **standardized** (`StandardScaler`).
- The model is trained for **10 epochs**, batch size **32**, across **3 random splits**
  (seeds 42, 357, 999), with the Keras session cleared between runs.
- Accuracy, Precision, Recall, F1, and ROC AUC are averaged across the 3 splits.

---

## Final Results (`combo_2.ipynb` → `fusion_results.csv`)

Averaged over 3 random train/test splits (80/20, stratified), sorted by Recall:

| Features | Accuracy | Precision | Recall | F1 | ROC AUC |
|---|---|---|---|---|---|
| **mfcc + centroid + pitch** | **0.9670** | 0.9475 | **0.9844** | 0.9656 | 0.9949 |
| mfcc + rms + pitch | 0.9670 | 0.9493 | 0.9825 | 0.9655 | 0.9932 |
| mfcc + pitch | 0.9579 | 0.9382 | 0.9747 | 0.9560 | 0.9934 |
| mfcc + centroid + rms + zcr | 0.9597 | 0.9453 | 0.9708 | 0.9578 | 0.9941 |
| mfcc + rms + zcr | 0.9634 | 0.9575 | 0.9649 | 0.9611 | 0.9944 |

### Best Configuration

The **`mfcc + centroid + pitch`** fusion model (Mel-spectrogram CNN + MFCC/Centroid/Pitch
statistics) achieved the best overall result:

- **Accuracy:** 96.70%
- **Precision:** 94.75%
- **Recall (Sensitivity to Sepsis):** 98.44%
- **F1 Score:** 96.56%
- **ROC AUC:** 0.9949

The high **recall** is the clinically important metric here — it indicates the model
rarely misses a true sepsis case (low false-negative rate), which is the priority for a
screening tool of this kind.

---

## Output Artifacts

| File | Produced By | Description |
|---|---|---|
| `clean_dataset.zip` | Phase 1 | Denoised, length-normalized audio |
| `*.pdf` (spectrogram/MFCC/pitch/RMS/ZCR comparison figures) | Phase 2 | Thesis-grade Normal vs Sepsis visualizations |
| `numerical_feature_ablation_results.csv` | Combo 1 | Single-split results across all 31 feature combos |
| `numerical_feature_ablation_3x_results.csv` | Combo 1 | 3-seed averaged results across all 31 feature combos |
| `fusion_results.csv` | Combo 2 | Final CNN+feature fusion results for top 5 combos |

---

## Tech Stack

- **Audio processing:** `librosa`, `noisereduce`, `soundfile`, `opencv (cv2)`
- **ML/DL:** `tensorflow.keras` (Sequential & Functional API), `scikit-learn`
- **Data handling:** `numpy`, `pandas`
- **Visualization:** `matplotlib`, `librosa.display`