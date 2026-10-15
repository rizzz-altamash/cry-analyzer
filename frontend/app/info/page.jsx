// app/info/page.jsx 
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  Cpu,
  Layers,
  Sliders,
  BarChart3,
  GitMerge,
  Volume2,
  Zap,
  CheckCircle2,
  Database,
  ExternalLink,
  TableProperties
} from "lucide-react";

export default function ModelInfoPage() {
  const [activeTab, setActiveTab] = useState("architecture");
  const [selectedComboIdx, setSelectedComboIdx] = useState(0);

  // Exact data from combo_2.ipynb evaluation run
  const topCombos = [
    {
      name: "MFCC + Centroid + Pitch",
      keys: ["mfcc", "centroid", "pitch"],
      dim: 36,
      accuracy: 96.70,
      precision: 94.74,
      recall: 98.45,
      f1: 96.55,
      roc_auc: 99.49,
      rank: 1,
      tag: "Highest Clinical Recall",
      description: "Combines 32-D cepstral frequency envelope, 2-D spectral brightness centroid, and 2-D YIN fundamental frequency (f0)."
    },
    {
      name: "MFCC + RMS + Pitch",
      keys: ["mfcc", "rms", "pitch"],
      dim: 36,
      accuracy: 96.70,
      precision: 94.92,
      recall: 98.24,
      f1: 96.53,
      roc_auc: 99.31,
      rank: 2,
      tag: "Acoustic Power & Pitch",
      description: "Focuses on infant vocal strain through cry volume fluctuations and fundamental pitch perturbations."
    },
    {
      name: "MFCC + Pitch",
      keys: ["mfcc", "pitch"],
      dim: 34,
      accuracy: 95.78,
      precision: 93.82,
      recall: 97.47,
      f1: 95.60,
      roc_auc: 99.34,
      rank: 3,
      tag: "Highest ROC-AUC (Tied)",
      description: "Stripped-down frequency pairing focusing strictly on vocal tract articulation and vocal cord vibration rate."
    },
    {
      name: "MFCC + Centroid + RMS + ZCR",
      keys: ["mfcc", "centroid", "rms", "zcr"],
      dim: 38,
      accuracy: 95.97,
      precision: 94.53,
      recall: 97.07,
      f1: 95.77,
      roc_auc: 99.41,
      rank: 4,
      tag: "Highest Energy Sensitivity",
      description: "Includes noise/noisiness metrics (Zero Crossing Rate) and acoustic power (RMS energy) alongside spectral brightness."
    },
    {
      name: "MFCC + RMS + ZCR",
      keys: ["mfcc", "rms", "zcr"],
      dim: 36,
      accuracy: 96.33,
      precision: 95.74,
      recall: 96.49,
      f1: 96.10,
      roc_auc: 99.43,
      rank: 5,
      tag: "Pitch-Free Robust Variant",
      description: "Omits fundamental frequency estimation, relying entirely on signal envelope, energy dynamics, and spectral noisiness."
    }
  ];

  const currentCombo = topCombos[selectedComboIdx];

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-16 selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inference Dashboard</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
            <Activity className="h-3.5 w-3.5" />
            <span>CryNet Deep Learning Engine Specifications</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 py-12">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
              <Zap className="h-3 w-3" /> Technical Whitepaper & Architecture
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Multi-Modal Parallel Fusion Architecture
            </h1>
            <p className="mt-3 text-slate-400 text-sm md:text-base leading-relaxed">
              Detailed technical blueprint of the <strong className="text-slate-200">CryNet Fusion Model</strong>. 
              The engine simultaneously processes spatial continuous frequency patterns (via a 2D Convolutional Neural Network) 
              and handcrafted biomechanical acoustic descriptors (via an Artificial Neural Network), fusing them into an 
              optimized classification head calibrated for clinical recall.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
            {[
              { id: "architecture", label: "CryNet Model Architecture", icon: Cpu },
              { id: "combos", label: "Top 5 Feature Combos (Benchmark)", icon: BarChart3 },
              { id: "pipeline", label: "Signal Preprocessing Flow", icon: Sliders },
              { id: "features", label: "Acoustic Features (40-D)", icon: Database }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                      : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        
        {/* ============================================================== */}
        {/* TAB 1: ARCHITECTURE (PARALLEL CNN + ANN FUSION) */}
        {/* ============================================================== */}
        {activeTab === "architecture" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Visual Stream Diagram */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                <GitMerge className="h-5 w-5 text-cyan-400" />
                Parallel Dual-Stream Architecture Flowchart
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mb-8">
                How audio is bifurcated into spatial 2D tensors and tabular acoustic vectors, trained synchronously with Adam (lr=0.0003).
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative">
                {/* Branch 1: CNN */}
                <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-blue-400" />
                      <h3 className="font-bold text-blue-200 text-sm uppercase tracking-wider">Stream A: 2D Spatial CNN</h3>
                    </div>
                    <span className="text-xs font-mono bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                      (128, 128, 1) Input
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Conv2D (32 filters, 3x3, same)</span>
                      <span className="text-blue-400">ReLU</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 text-slate-500 text-[11px] flex justify-between">
                      <span>MaxPooling2D (2x2) + Dropout(0.1)</span>
                      <span>Output: (64, 64, 32)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Conv2D (64 filters, 3x3, same)</span>
                      <span className="text-blue-400">ReLU</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 text-slate-500 text-[11px] flex justify-between">
                      <span>MaxPooling2D (2x2) + Dropout(0.2)</span>
                      <span>Output: (32, 32, 64)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Conv2D (128 filters, 3x3, same)</span>
                      <span className="text-blue-400">ReLU</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 text-slate-500 text-[11px] flex justify-between">
                      <span>MaxPooling2D (2x2) + Dropout(0.3)</span>
                      <span>Output: (16, 16, 128)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-900/30 border border-blue-700/40 text-blue-200 flex justify-between">
                      <span>GlobalAveragePooling2D()</span>
                      <span>128-D Spatial Pooling</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 flex justify-between">
                      <span>Dense(128, ReLU) + Dropout(0.3)</span>
                      <span className="text-cyan-400">Embedding: 128-D</span>
                    </div>
                  </div>
                </div>

                {/* Branch 2: ANN Feature Stream */}
                <div className="rounded-xl border border-purple-900/50 bg-purple-950/20 p-5 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-purple-400" />
                      <h3 className="font-bold text-purple-200 text-sm uppercase tracking-wider">Stream B: 1D Feature ANN</h3>
                    </div>
                    <span className="text-xs font-mono bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded">
                      (feature_dim) Input
                    </span>
                  </div>

                  <div className="space-y-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Dense Layer (128 units, ReLU)</span>
                      <span className="text-purple-400">Dropout(0.3)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Dense Layer (64 units, ReLU)</span>
                      <span className="text-purple-400">Dropout(0.2)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-900/30 border border-purple-700/40 text-purple-200 flex justify-between">
                      <span>Acoustic Latent Embedding</span>
                      <span className="text-cyan-400">Output: 64-D</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-900 text-slate-500 text-[11px] leading-relaxed">
                      Learns high-order non-linear correlations across MFCCs, Spectral Centroid brightness shifts, RMS power, and vocal cord pitch perturbations.
                    </div>
                  </div>
                </div>
              </div>

              {/* Fusion & Classification Head */}
              <div className="mt-8 rounded-xl border border-cyan-800/60 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-blue-950/30 p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <GitMerge className="h-4 w-4 text-cyan-400" />
                    Fusion Junction & Classification Head
                  </h3>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950 border border-cyan-700/50 px-2.5 py-0.5 rounded-full">
                    Concatenate([128-D, 64-D]) = 192-D Merged Tensor
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <p className="text-slate-400 mb-1">Dense Block 1</p>
                    <p className="font-semibold text-white">Dense(128, ReLU)</p>
                    <p className="text-[11px] text-cyan-400 mt-0.5">Dropout rate: 0.3</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <p className="text-slate-400 mb-1">Dense Block 2</p>
                    <p className="font-semibold text-white">Dense(64, ReLU)</p>
                    <p className="text-[11px] text-cyan-400 mt-0.5">Dropout rate: 0.2</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                    <p className="text-slate-400 mb-1">Terminal Layer</p>
                    <p className="font-semibold text-amber-400">Dense(1, Sigmoid)</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Threshold: p ≥ 0.40</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Optimizer & Learning Rate</p>
                <p className="text-xl font-bold text-white mt-1">Adam</p>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">Learning Rate: 0.0003</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Loss Function</p>
                <p className="text-xl font-bold text-white mt-1">Binary Crossentropy</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Target: 0 (Normal) | 1 (Sepsis)</p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Batch & Epochs</p>
                <p className="text-xl font-bold text-white mt-1">10 Epochs</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Batch Size: 32 samples</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: TOP 5 COMBINATIONS BENCHMARK */}
        {/* ============================================================== */}
        {activeTab === "combos" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Combo Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {topCombos.map((combo, idx) => {
                const isSelected = selectedComboIdx === idx;
                return (
                  <button
                    key={combo.name}
                    onClick={() => setSelectedComboIdx(idx)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                      RANK #{combo.rank}
                    </span>
                    <h3 className="text-xs font-bold text-white mt-1 truncate">{combo.name}</h3>
                    <p className="text-lg font-extrabold text-cyan-400 mt-2 font-mono">
                      {combo.recall.toFixed(2)}%
                    </p>
                    <span className="text-[10px] text-slate-400">Recall Score</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Combo Deep Dive */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500 text-slate-950 font-mono">
                      RANK #{currentCombo.rank}
                    </span>
                    <span className="text-xs font-semibold text-cyan-400 font-mono">
                      {currentCombo.tag}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-2">{currentCombo.name}</h2>
                  <p className="text-sm text-slate-400 mt-1">{currentCombo.description}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Vector Dimension</p>
                    <p className="text-lg font-bold font-mono text-cyan-400">{currentCombo.dim}-D</p>
                  </div>
                </div>
              </div>

              {/* Metrics Visual Grid */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: "Recall (Sensitivity)", val: currentCombo.recall, high: true },
                  { label: "Accuracy", val: currentCombo.accuracy, high: false },
                  { label: "Precision", val: currentCombo.precision, high: false },
                  { label: "F1-Score", val: currentCombo.f1, high: false },
                  { label: "ROC-AUC", val: currentCombo.roc_auc, high: false }
                ].map((metric) => (
                  <div key={metric.label} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium truncate">{metric.label}</p>
                    <p className="text-2xl font-black font-mono text-white mt-2">
                      {metric.val.toFixed(2)}%
                    </p>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${metric.high ? "bg-cyan-400" : "bg-blue-500"}`}
                        style={{ width: `${metric.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmark Table Directly from combo_2.ipynb */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 overflow-x-auto">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <TableProperties className="h-5 w-5 text-cyan-400" />
                Comprehensive 3x-Split Evaluation Benchmark (combo_2.ipynb)
              </h3>
              <table className="w-full text-left text-xs md:text-sm font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Pipeline Features</th>
                    <th className="py-3 px-3">Dims</th>
                    <th className="py-3 px-3">Recall</th>
                    <th className="py-3 px-3">Accuracy</th>
                    <th className="py-3 px-3">Precision</th>
                    <th className="py-3 px-3">F1</th>
                    <th className="py-3 px-3">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {topCombos.map((combo) => (
                    <tr
                      key={combo.name}
                      className={combo.rank === 1 ? "bg-cyan-950/30 text-cyan-200" : "hover:bg-slate-900/80"}
                    >
                      <td className="py-3 px-3 font-bold text-cyan-400">#{combo.rank}</td>
                      <td className="py-3 px-3 font-semibold text-white">{combo.name}</td>
                      <td className="py-3 px-3">{combo.dim}D</td>
                      <td className="py-3 px-3 font-bold text-cyan-400">{combo.recall.toFixed(2)}%</td>
                      <td className="py-3 px-3">{combo.accuracy.toFixed(2)}%</td>
                      <td className="py-3 px-3">{combo.precision.toFixed(2)}%</td>
                      <td className="py-3 px-3">{combo.f1.toFixed(2)}%</td>
                      <td className="py-3 px-3 text-blue-400">{combo.roc_auc.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SIGNAL PREPROCESSING FLOW */}
        {/* ============================================================== */}
        {activeTab === "pipeline" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs font-mono text-cyan-400 font-bold">STEP 01</span>
                <h3 className="font-bold text-white text-base mt-1">16 kHz Resampling</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Raw audio streams are converted from variable sample rates (e.g. 44.1 kHz, 48 kHz) to a single standard 
                  Nyquist frequency of 16,000 samples/sec.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs font-mono text-cyan-400 font-bold">STEP 02</span>
                <h3 className="font-bold text-white text-base mt-1">1.0s Fixed Window</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Audio signals are calibrated to exactly 16,000 samples. Audio longer than 1.0s is sliced; 
                  shorter cries are zero-padded along the tail.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs font-mono text-cyan-400 font-bold">STEP 03</span>
                <h3 className="font-bold text-white text-base mt-1">Noise Reduction</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Stationary background hum (ventilators, room reverberations) is suppressed via non-stationary 
                  spectral gating using noisereduce.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60">
                <span className="text-xs font-mono text-cyan-400 font-bold">STEP 04</span>
                <h3 className="font-bold text-white text-base mt-1">Dual Stream Routing</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Denoised signal is routed simultaneously to the 2D Mel-Spectrogram transformer and the 
                  1D acoustic feature calculator.
                </p>
              </div>
            </div>

            {/* Decision Threshold Callout */}
            <div className="rounded-2xl border border-amber-800/60 bg-amber-950/20 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  Clinical Tuning Parameter
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Custom Decision Threshold: p ≥ 0.40
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  In neonatal healthcare, false negatives are catastrophic (a septic infant classified as normal). 
                  Standard 0.50 boundaries are lowered to 0.40, deliberately shifting the model toward maximum clinical sensitivity/recall.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black font-mono text-amber-400">0.40</p>
                <p className="text-[11px] text-slate-500 font-mono">Threshold Applied</p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: ACOUSTIC FEATURES (40-D BASE DICTIONARY) */}
        {/* ============================================================== */}
        {activeTab === "features" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" />
                40-Dimensional Feature Extraction Dictionary
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mb-6">
                All 5 fusion pipelines are dynamic subsets of this base 40-dimensional feature vector, scaled by a pre-fitted StandardScaler.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-sm">MFCC (Mel-Frequency Cepstral Coefficients)</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">32 Dimensions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    16 coefficients extracted across time frames. 16 means + 16 standard deviations capture vocal tract shaping and resonant formant transitions.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-sm">Spectral Centroid</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">2 Dimensions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Mean & standard deviation of the center of mass of the spectrum. Measures sound sharpness and high-frequency energy concentration.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-sm">Root Mean Square Energy (RMS)</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">2 Dimensions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Mean & standard deviation of signal power. Detects breathlessness, cry weakness, and sudden bursts characteristic of neonatal distress.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-sm">Zero Crossing Rate (ZCR)</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">2 Dimensions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Rate at which the signal changes signs. Differentiates unvoiced acoustic breath noise from voiced, sustained vocal cord crying.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 md:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-white text-sm">Pitch / Fundamental Frequency (YIN Algorithm)</h3>
                    <span className="text-xs font-mono text-cyan-400 font-bold">2 Dimensions</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Extracted fundamental frequency (f0) between 50 Hz and 1000 Hz. Mean & standard deviation of pitch identify hyper-pitch instability and vocal cord constriction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}