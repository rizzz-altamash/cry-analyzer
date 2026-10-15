// app/page.js 
// "use client";

// import { useState } from "react";
// import {
//   UploadCloud,
//   Activity,
//   AlertTriangle,
//   CheckCircle,
//   FileAudio,
//   BarChart2,
// } from "lucide-react";

// export default function Home() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setFile(e.target.files[0]);
//       setData(null);
//       setError(null);
//     }
//   };

//   const handleAnalyze = async () => {
//     if (!file) return;

//     setLoading(true);
//     setError(null);
//     setData(null);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/v1/predict",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Server error: ${response.statusText}`);
//       }

//       const responseData = await response.json();
//       setData(responseData);
//     } catch (err) {
//       console.error(err);
//       setError(
//         "Failed to connect to the analysis engine. Ensure the backend is running."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-slate-950 text-white">
//       {/* Header */}
//       <header className="border-b border-slate-800 bg-slate-950">
//         <div className="mx-auto max-w-6xl px-6 py-8">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
//               <Activity className="h-7 w-7 text-cyan-400" />
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Neonatal Cry Analysis
//               </h1>

//               <p className="mt-1 text-sm text-slate-400">
//                 Multi-Pipeline Sepsis Screening Ensemble
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="mx-auto max-w-6xl px-6 py-10">
//         {/* Upload Section */}
//         <section className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold text-white">
//               Select Audio File
//             </h2>

//             <p className="mt-2 text-sm text-slate-400">
//               Supported formats: WAV, MP3, OGG, M4A
//             </p>
//           </div>

//           {/* Upload Area */}
//           <label
//             htmlFor="audio-upload"
//             className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/60 px-6 py-14 transition hover:border-cyan-500 hover:bg-slate-950"
//           >
//             <UploadCloud className="mb-4 h-12 w-12 text-cyan-400" />

//             <p className="text-lg font-medium text-white">
//               Click to upload audio
//             </p>

//             <p className="mt-2 text-sm text-slate-500">
//               Upload a neonatal cry recording for analysis
//             </p>

//             <input
//               id="audio-upload"
//               type="file"
//               accept=".wav,.mp3,.ogg,.m4a,audio/*"
//               onChange={handleFileChange}
//               className="hidden"
//             />
//           </label>

//           {/* Selected File */}
//           {file && (
//             <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 p-4">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
//                 <FileAudio className="h-5 w-5 text-cyan-400" />
//               </div>

//               <div className="min-w-0 flex-1">
//                 <p className="truncate font-medium text-white">
//                   {file.name}
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   {(file.size / 1024 / 1024).toFixed(2)} MB
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Analyze Button */}
//           <button
//             type="button"
//             onClick={handleAnalyze}
//             disabled={!file || loading}
//             className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {loading ? (
//               <>
//                 <Activity className="h-5 w-5 animate-spin" />
//                 Processing 5 Neural Pipelines...
//               </>
//             ) : (
//               <>
//                 <BarChart2 className="h-5 w-5" />
//                 Run Ensemble Inference
//               </>
//             )}
//           </button>

//           {/* Error */}
//           {error && (
//             <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-900 bg-red-950/30 p-4 text-red-300">
//               <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

//               <p className="text-sm">{error}</p>
//             </div>
//           )}
//         </section>

//         {/* Global Audio Stats */}
//         {data && (
//           <section className="mt-8">
//             <div className="mb-4 flex items-center gap-2">
//               <Activity className="h-5 w-5 text-cyan-400" />

//               <h2 className="text-xl font-semibold">
//                 Audio Analysis
//               </h2>
//             </div>

//             <div className="grid gap-4 sm:grid-cols-3">
//               {/* Target Sample Rate */}
//               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-sm text-slate-400">
//                   Target Sample Rate
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-white">
//                   {data.target_sample_rate} Hz
//                 </p>
//               </div>

//               {/* Audio Duration */}
//               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-sm text-slate-400">
//                   Audio Duration
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-white">
//                   {data.original_duration_seconds} s
//                 </p>
//               </div>

//               {/* Mean Pitch */}
//               <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
//                 <p className="text-sm text-slate-400">
//                   Mean Pitch (f0)
//                 </p>

//                 <p className="mt-2 text-2xl font-bold text-white">
//                   {data.pitch_mean_hz} Hz
//                 </p>
//               </div>
//             </div>
//           </section>
//         )}

//         {/* 5-Combo Pipeline Results */}
//         {data && Array.isArray(data.results) && (
//           <section className="mt-10">
//             <div className="mb-6 flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
//                 <BarChart2 className="h-5 w-5 text-cyan-400" />
//               </div>

//               <div>
//                 <h2 className="text-xl font-semibold">
//                   Pipeline Ensemble Results
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-400">
//                   Results from {data.results.length} neural pipelines
//                 </p>
//               </div>
//             </div>

//             <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
//               {data.results.map((res, index) => (
//                 <div
//                   key={`${res.pipeline_name}-${index}`}
//                   className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg"
//                 >
//                   {/* Pipeline Header */}
//                   <div className="mb-5 flex items-start justify-between gap-4">
//                     <div>
//                       <p className="text-xs font-semibold tracking-widest text-cyan-400">
//                         PIPELINE {index + 1}
//                       </p>

//                       <h3 className="mt-2 text-lg font-bold text-white">
//                         {res.pipeline_name}
//                       </h3>
//                     </div>

//                     {res.has_sepsis ? (
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
//                         <AlertTriangle className="h-5 w-5 text-red-400" />
//                       </div>
//                     ) : (
//                       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
//                         <CheckCircle className="h-5 w-5 text-green-400" />
//                       </div>
//                     )}
//                   </div>

//                   {/* Classification */}
//                   <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
//                     <p className="text-xs uppercase tracking-wide text-slate-500">
//                       Classification
//                     </p>

//                     <p
//                       className={`mt-2 text-lg font-bold ${
//                         res.has_sepsis
//                           ? "text-red-400"
//                           : "text-green-400"
//                       }`}
//                     >
//                       {res.has_sepsis
//                         ? "Sepsis Detected"
//                         : "Normal"}
//                     </p>

//                     <p className="mt-1 text-sm text-slate-400">
//                       Risk Level:{" "}
//                       <span className="font-medium text-white">
//                         {res.risk_level}
//                       </span>
//                     </p>
//                   </div>

//                   {/* Confidence */}
//                   <div className="mt-5">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-slate-400">
//                         Confidence
//                       </span>

//                       <span className="text-sm font-semibold text-white">
//                         {(res.probability * 100).toFixed(1)}%
//                       </span>
//                     </div>

//                     <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
//                       <div
//                         className={`h-full rounded-full ${
//                           res.has_sepsis
//                             ? "bg-red-500"
//                             : "bg-green-500"
//                         }`}
//                         style={{
//                           width: `${Math.min(
//                             Math.max(res.probability * 100, 0),
//                             100
//                           )}%`,
//                         }}
//                       />
//                     </div>
//                   </div>

//                   {/* Feature Dimension */}
//                   <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
//                     <span className="text-sm text-slate-500">
//                       Vector Dimension
//                     </span>

//                     <span className="font-semibold text-slate-200">
//                       {res.feature_dimension}D
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         )}
//       </div>
//     </main>
//   );
// }



// app/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  Activity,
  AlertTriangle,
  CheckCircle,
  FileAudio,
  BarChart2,
  LoaderCircle,
  Sun,
  Moon,
  Info,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setData(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/v1/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (err) {
      console.error(err);

      setError(
        "Failed to connect to the analysis engine. Ensure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Ensemble Majority Vote
  // More than 2 Normal -> Normal
  // More than 2 Sepsis -> Sepsis
  // ---------------------------------------------------------
  const normalCount =
    data && Array.isArray(data.results)
      ? data.results.filter((res) => !res.has_sepsis).length
      : 0;

  const sepsisCount =
    data && Array.isArray(data.results)
      ? data.results.filter((res) => res.has_sepsis).length
      : 0;

  const ensembleVerdict =
    normalCount > 2
      ? "Normal"
      : sepsisCount > 2
      ? "Sepsis"
      : "Inconclusive";

  const isSepsis = ensembleVerdict === "Sepsis";
  const isNormal = ensembleVerdict === "Normal";

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 ${
          darkMode
            ? "border-slate-800 bg-slate-950"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          {/* Logo / Title */}
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                darkMode
                  ? "bg-cyan-500/10"
                  : "bg-cyan-100"
              }`}
            >
              <Activity
                className={`h-7 w-7 ${
                  darkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                Neonatal Cry Analyzer
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  CryNet
                </span>
              </h1>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Multi-Modal Deep Learning Sepsis Screening Ensemble
              </p>
            </div>
          </div>

          {/* Info & Theme Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Link
                href="/info"
                className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/90 text-sm font-medium text-slate-200 transition-all hover:border-cyan-400 hover:bg-cyan-950/30 hover:text-cyan-300 shadow-sm"
                title="View Model Architecture & Engine Pipeline"
              >
                <Info className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
                <span>Model Architecture</span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle theme"
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* =====================================================
            Upload Section
        ====================================================== */}
        <section
          className={`rounded-2xl border p-8 shadow-xl transition-colors duration-300 ${
            darkMode
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Upload Audio File
            </h2>

            <p
              className={`mt-2 text-sm ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Supported format: WAV
              {/* Supported formats: WAV, MP3, OGG, M4A */}
            </p>
          </div>

          {/* Upload Area */}
          <label
            htmlFor="audio-upload"
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-14 transition ${
              darkMode
                ? "border-slate-700 bg-slate-950/60 hover:border-cyan-500 hover:bg-slate-950"
                : "border-slate-300 bg-slate-50 hover:border-cyan-500 hover:bg-cyan-50/40"
            }`}
          >
            <UploadCloud
              className={`mb-4 h-12 w-12 ${
                darkMode ? "text-cyan-400" : "text-cyan-600"
              }`}
            />

            <p className="text-lg font-medium">
              Click to upload audio
            </p>

            <p
              className={`mt-2 text-sm ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              Upload a neonatal cry recording for analysis
            </p>

            <input
              id="audio-upload"
              type="file"
              accept=".wav,.mp3,.ogg,.m4a,audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Selected File */}
          {file && (
            <div
              className={`mt-5 flex items-center gap-3 rounded-xl border p-4 ${
                darkMode
                  ? "border-slate-700 bg-slate-950"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  darkMode
                    ? "bg-cyan-500/10"
                    : "bg-cyan-100"
                }`}
              >
                <FileAudio
                  className={`h-5 w-5 ${
                    darkMode
                      ? "text-cyan-400"
                      : "text-cyan-600"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {file.name}
                </p>

                <p
                  className={`mt-1 text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                {/* Proper spinner */}
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Processing 5 Neural Pipelines...
              </>
            ) : (
              <>
                <BarChart2 className="h-5 w-5" />
                Run Ensemble Inference
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div
              className={`mt-5 flex items-start gap-3 rounded-xl border p-4 ${
                darkMode
                  ? "border-red-900 bg-red-950/30 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* Ensemble Verdict - Appears directly below upload section */}
        {data && Array.isArray(data.results) && (
          <section
            className={`mt-6 rounded-2xl border p-6 shadow-lg transition-colors duration-300 ${
              isSepsis
                ? darkMode
                  ? "border-red-800 bg-red-950/30"
                  : "border-red-200 bg-red-50"
                : isNormal
                ? darkMode
                  ? "border-green-800 bg-green-950/30"
                  : "border-green-200 bg-green-50"
                : darkMode
                ? "border-yellow-800 bg-yellow-950/30"
                : "border-yellow-200 bg-yellow-50"
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              {/* Verdict */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                    isSepsis
                      ? darkMode
                        ? "bg-red-500/10"
                        : "bg-red-100"
                      : isNormal
                      ? darkMode
                        ? "bg-green-500/10"
                        : "bg-green-100"
                      : darkMode
                      ? "bg-yellow-500/10"
                      : "bg-yellow-100"
                  }`}
                >
                  {isSepsis ? (
                    <AlertTriangle className="h-7 w-7 text-red-500" />
                  ) : isNormal ? (
                    <CheckCircle className="h-7 w-7 text-green-500" />
                  ) : (
                    <Activity className="h-7 w-7 text-yellow-500" />
                  )}
                </div>

                <div>
                  <h2
                    className={`mt-1 text-3xl font-extrabold ${
                      isSepsis
                        ? "text-red-500"
                        : isNormal
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {ensembleVerdict}
                  </h2>
                </div>
              </div>

              {/* Voting Summary */}
              <div
                className={`rounded-xl border px-5 py-4 ${
                  darkMode
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p
                  className={`text-xs uppercase tracking-wide ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  Majority Vote
                </p>

                <div className="mt-2 flex items-center gap-5 text-sm">
                  <span className="font-semibold text-green-500">
                    Normal: {normalCount}/5
                  </span>

                  <span className="font-semibold text-red-500">
                    Sepsis: {sepsisCount}/5
                  </span>
                </div>

                <p
                  className={`mt-2 text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  Verdict based on 3+ matching pipeline predictions.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            Global Audio Stats
        ====================================================== */}
        {data && (
          <section className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <Activity
                className={`h-5 w-5 ${
                  darkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              />

              <h2 className="text-xl font-semibold">
                Audio Analysis
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Target Sample Rate */}
              <div
                className={`rounded-xl border p-5 transition-colors duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Target Sample Rate
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {data.target_sample_rate} Hz
                </p>
              </div>

              {/* Audio Duration */}
              <div
                className={`rounded-xl border p-5 transition-colors duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Audio Duration
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {data.original_duration_seconds} s
                </p>
              </div>

              {/* Mean Pitch */}
              <div
                className={`rounded-xl border p-5 transition-colors duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Mean Pitch (f0)
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {data.pitch_mean_hz} Hz
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            5-Pipeline Results
        ====================================================== */}
        {data && Array.isArray(data.results) && (
          <section className="mt-10">
            <div className="mb-6 flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  darkMode
                    ? "bg-cyan-500/10"
                    : "bg-cyan-100"
                }`}
              >
                <BarChart2
                  className={`h-5 w-5 ${
                    darkMode ? "text-cyan-400" : "text-cyan-600"
                  }`}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Pipeline Ensemble Results
                </h2>

                <p
                  className={`mt-1 text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Results from {data.results.length} neural pipelines
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.results.map((res, index) => (
                <div
                  key={`${res.pipeline_name}-${index}`}
                  className={`rounded-2xl border p-6 shadow-lg transition-colors duration-300 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  {/* Pipeline Header */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-xs font-semibold tracking-widest ${
                          darkMode
                            ? "text-cyan-400"
                            : "text-cyan-600"
                        }`}
                      >
                        PIPELINE {index + 1}
                      </p>

                      <h3 className="mt-2 text-lg font-bold">
                        {res.pipeline_name}
                      </h3>
                    </div>

                    {res.has_sepsis ? (
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          darkMode
                            ? "bg-red-500/10"
                            : "bg-red-100"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                    ) : (
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                          darkMode
                            ? "bg-green-500/10"
                            : "bg-green-100"
                        }`}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>

                  {/* Classification */}
                  <div
                    className={`rounded-xl border p-4 ${
                      darkMode
                        ? "border-slate-800 bg-slate-950"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-wide ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-500"
                      }`}
                    >
                      Classification
                    </p>

                    <p
                      className={`mt-2 text-lg font-bold ${
                        res.has_sepsis
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {res.has_sepsis
                        ? "Sepsis Detected"
                        : "Normal"}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Risk Level:{" "}
                      <span className="font-medium">
                        {res.risk_level}
                      </span>
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        Confidence
                      </span>

                      <span className="text-sm font-semibold">
                        {(res.probability * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div
                      className={`mt-2 h-2 overflow-hidden rounded-full ${
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          res.has_sepsis
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(res.probability * 100, 0),
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Feature Dimension */}
                  <div
                    className={`mt-5 flex items-center justify-between border-t pt-4 ${
                      darkMode
                        ? "border-slate-800"
                        : "border-slate-200"
                    }`}
                  >
                    <span
                      className={`text-sm ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-500"
                      }`}
                    >
                      Vector Dimension
                    </span>

                    <span className="font-semibold">
                      {res.feature_dimension}D
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload