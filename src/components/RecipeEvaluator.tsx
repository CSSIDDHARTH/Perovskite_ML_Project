import React, { useState, useEffect } from 'react';
import {
  RecipeInput,
  EvaluationResult,
  DeviceArchitecture,
  PerovskiteComposition,
  ETLRecipe,
  HTLRecipe,
  SubstrateType,
} from '../types';
import { computePhysicsInformedPrediction, callTrainedModel, checkBackendHealth } from '../lib/modelSimulator';
import { DeviceStackVisualizer } from './DeviceStackVisualizer';
import { RecipeSensitivityChart } from './RecipeSensitivityChart';
import {
  Sparkles,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sliders,
  BarChart3,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';

interface RecipeEvaluatorProps {
  initialRecipe?: Partial<RecipeInput>;
  onInspectCandidate?: (recipe: RecipeInput) => void;
}

const DEFAULT_RECIPE: RecipeInput = {
  architecture: 'nip',
  composition: 'Triple-Cation (Cs/FA/MA)',
  annealTemp: 100,
  annealTime: 30,
  layerThickness: 420,
  etlRecipe: 'SnO2 (spin-coated)',
  htlRecipe: 'Spiro-OMeTAD',
  substrate: 'SLG | FTO',
};

const PRESETS: { name: string; recipe: RecipeInput }[] = [
  {
    name: 'Triple-Cation Benchmark (nip)',
    recipe: {
      architecture: 'nip',
      composition: 'Triple-Cation (Cs/FA/MA)',
      annealTemp: 100,
      annealTime: 35,
      layerThickness: 450,
      etlRecipe: 'SnO2 (spin-coated)',
      htlRecipe: 'Spiro-OMeTAD',
      substrate: 'SLG | FTO',
    },
  },
  {
    name: 'Inverted SAM 2PACz Champion (pin)',
    recipe: {
      architecture: 'pin',
      composition: 'FA-Cs-Pb-I-Br',
      annealTemp: 120,
      annealTime: 20,
      layerThickness: 500,
      etlRecipe: 'C60 / BCP',
      htlRecipe: '2PACz',
      substrate: 'SLG | ITO',
    },
  },
  {
    name: 'High-Stability Mixed Halide',
    recipe: {
      architecture: 'nip',
      composition: 'Cs-FA-MA-Pb-I-Br',
      annealTemp: 105,
      annealTime: 30,
      layerThickness: 430,
      etlRecipe: 'TiO2 (compact+mesoporous)',
      htlRecipe: 'PTAA',
      substrate: 'SLG | FTO',
    },
  },
  {
    name: 'Classic MAPbI3 Control',
    recipe: {
      architecture: 'nip',
      composition: 'MAPbI3',
      annealTemp: 100,
      annealTime: 45,
      layerThickness: 380,
      etlRecipe: 'SnO2 (spin-coated)',
      htlRecipe: 'Spiro-OMeTAD',
      substrate: 'SLG | FTO',
    },
  },
];

export const RecipeEvaluator: React.FC<RecipeEvaluatorProps> = ({ initialRecipe }) => {
  const [recipe, setRecipe] = useState<RecipeInput>({ ...DEFAULT_RECIPE, ...initialRecipe });
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EvaluationResult>(() => computePhysicsInformedPrediction(DEFAULT_RECIPE));
  const [activeTab, setActiveTab] = useState<'results' | 'shap' | 'apiHook'>('results');
  const [customApiUrl, setCustomApiUrl] = useState<string>('/api/predict');
  const [useRemoteApi, setUseRemoteApi] = useState<boolean>(true);
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; info?: any }>({ connected: false });

  // Auto-detect backend health on mount
  useEffect(() => {
    checkBackendHealth().then((status) => {
      setBackendStatus(status);
      if (status.connected) {
        setUseRemoteApi(true);
      }
    });
  }, []);

  // Sync if parent passes selected candidate
  useEffect(() => {
    if (initialRecipe) {
      setRecipe((prev) => ({ ...prev, ...initialRecipe }));
      setResult(computePhysicsInformedPrediction({ ...recipe, ...initialRecipe }));
    }
  }, [initialRecipe]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const pred = await callTrainedModel(recipe, useRemoteApi ? customApiUrl : undefined);
      setResult(pred);
    } catch {
      setResult(computePhysicsInformedPrediction(recipe));
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: RecipeInput) => {
    setRecipe(preset);
    setResult(computePhysicsInformedPrediction(preset));
  };

  // Radial gauge progress math
  const maxPce = 26;
  const pcePercentage = Math.min(100, Math.max(0, (result.pce / maxPce) * 100));
  const gaugeCircumference = 2 * Math.PI * 54; // r=54
  const strokeDashoffset = gaugeCircumference - (pcePercentage / 100) * gaugeCircumference;

  return (
    <section id="evaluator" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono tracking-wider uppercase text-cyan-400">
                Interactive Lab Tool · Forward Prediction & Uncertainty
              </span>
              {backendStatus.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ML Backend Live (Port 8000)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Local Engine (Standalone)
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
              Interactive Recipe Evaluator & Screening
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Configure complete thin-film device parameters to estimate Power Conversion Efficiency ($PCE$), intermediate diode parameters, and calibrated 90% conformal uncertainty intervals.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => handlePresetSelect(p.recipe)}
                className="px-2.5 py-1 text-xs font-medium bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 rounded-md transition-all whitespace-nowrap shrink-0"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Console: Inputs on Left, Results & Visuals on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Parameter Form (lg:col-span-6) */}
          <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-base font-semibold text-white font-heading">
                  Fabrication & Stack Parameters
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">8 Feature Vectors</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Device Architecture */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Device Architecture</span>
                  <span className="text-[10px] font-mono text-slate-400">Stack sequence</span>
                </label>
                <select
                  value={recipe.architecture}
                  onChange={(e) =>
                    setRecipe({ ...recipe, architecture: e.target.value as DeviceArchitecture })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-100 font-mono transition-colors"
                >
                  <option value="nip">nip (regular / conventional)</option>
                  <option value="pin">pin (inverted / p-i-n)</option>
                </select>
              </div>

              {/* Perovskite Composition Family */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Composition Family</span>
                  <span className="text-[10px] font-mono text-slate-400">ABX3 stoichiometry</span>
                </label>
                <select
                  value={recipe.composition}
                  onChange={(e) =>
                    setRecipe({
                      ...recipe,
                      composition: e.target.value as PerovskiteComposition,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-100 font-mono transition-colors"
                >
                  <option value="Triple-Cation (Cs/FA/MA)">Triple-Cation (Cs/FA/MA)</option>
                  <option value="FA-Cs-Pb-I-Br">FA-Cs-Pb-I-Br (Double-Cation)</option>
                  <option value="Cs-FA-MA-Pb-I-Br">Cs-FA-MA-Pb-I-Br (High-Entropy)</option>
                  <option value="MAPbI3">MAPbI3 (Methylammonium Lead)</option>
                  <option value="CsPbI3">CsPbI3 (All-Inorganic)</option>
                </select>
              </div>

              {/* ETL Recipe */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>ETL Recipe</span>
                  <span className="text-[10px] font-mono text-slate-400">Electron Extraction</span>
                </label>
                <select
                  value={recipe.etlRecipe}
                  onChange={(e) =>
                    setRecipe({ ...recipe, etlRecipe: e.target.value as ETLRecipe })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-100 font-mono transition-colors"
                >
                  <option value="SnO2 (spin-coated)">SnO2 (spin-coated, colloidal)</option>
                  <option value="TiO2 (compact+mesoporous)">TiO2 (compact + mesoporous)</option>
                  <option value="C60 / BCP">C60 / BCP (Thermally evaporated)</option>
                  <option value="ZnO">ZnO (Nanoparticle sol-gel)</option>
                </select>
              </div>

              {/* HTL Recipe */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>HTL Recipe</span>
                  <span className="text-[10px] font-mono text-slate-400">Hole Extraction</span>
                </label>
                <select
                  value={recipe.htlRecipe}
                  onChange={(e) =>
                    setRecipe({ ...recipe, htlRecipe: e.target.value as HTLRecipe })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-100 font-mono transition-colors"
                >
                  <option value="Spiro-OMeTAD">Spiro-OMeTAD (Doped, LiTFSI)</option>
                  <option value="PTAA">PTAA (Polymeric dopant-free)</option>
                  <option value="NiOx (nanoparticle)">NiOx (nanoparticle / sputtered)</option>
                  <option value="2PACz">2PACz (Self-Assembled Monolayer)</option>
                </select>
              </div>

              {/* Substrate */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Transparent Conductive Substrate</span>
                  <span className="text-[10px] font-mono text-slate-400">Optoelectronic entrance</span>
                </label>
                <select
                  value={recipe.substrate}
                  onChange={(e) =>
                    setRecipe({ ...recipe, substrate: e.target.value as SubstrateType })
                  }
                  className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-400 focus:outline-none rounded-lg px-3 py-2 text-sm text-slate-100 font-mono transition-colors"
                >
                  <option value="SLG | FTO">SLG | FTO (Soda-Lime Glass + Fluorine Tin Oxide)</option>
                  <option value="SLG | ITO">SLG | ITO (Soda-Lime Glass + Indium Tin Oxide)</option>
                </select>
              </div>
            </div>

            {/* Continuous Numerical Sliders with Synchronized Readouts */}
            <div className="space-y-5 pt-3 border-t border-slate-800">
              {/* Annealing Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Annealing Temperature (°C)
                  </label>
                  <div className="flex items-center gap-1 font-mono text-xs">
                    <input
                      type="number"
                      min={70}
                      max={160}
                      value={recipe.annealTemp}
                      onChange={(e) =>
                        setRecipe({ ...recipe, annealTemp: Math.max(70, Math.min(160, Number(e.target.value) || 70)) })
                      }
                      className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-right text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
                    />
                    <span className="text-slate-400">°C</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={70}
                  max={160}
                  step={1}
                  value={recipe.annealTemp}
                  onChange={(e) => setRecipe({ ...recipe, annealTemp: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>70 °C</span>
                  <span className={recipe.annealTemp > 150 ? 'text-amber-400 font-medium' : ''}>
                    {recipe.annealTemp > 150 ? 'MA Thermal Warning (>150°C)' : 'Nominal (100–120°C)'}
                  </span>
                  <span>160 °C</span>
                </div>
              </div>

              {/* Annealing Time */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Annealing Duration (min)
                  </label>
                  <span className="font-mono text-xs text-cyan-300 font-semibold">
                    {recipe.annealTime} <span className="text-slate-400 font-normal">min</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={1}
                  value={recipe.annealTime}
                  onChange={(e) => setRecipe({ ...recipe, annealTime: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>2 min (Flash)</span>
                  <span>30 min (Standard)</span>
                  <span>60 min (Extended)</span>
                </div>
              </div>

              {/* Perovskite Layer Thickness */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300">
                    Perovskite Absorber Thickness (nm)
                  </label>
                  <span className="font-mono text-xs text-cyan-300 font-semibold">
                    {recipe.layerThickness} <span className="text-slate-400 font-normal">nm</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={650}
                  step={10}
                  value={recipe.layerThickness}
                  onChange={(e) => setRecipe({ ...recipe, layerThickness: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>200 nm (Thin)</span>
                  <span>450 nm (Optimum)</span>
                  <span>650 nm (Thick)</span>
                </div>
              </div>
            </div>

            {/* Action Button: Screen & Predict Recipe */}
            <div className="pt-2">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full py-3 px-4 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-teal-200 disabled:opacity-60 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Executing 2-Stage Physics Ensemble...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                    <span>Screen & Predict Recipe</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Prediction Results Panel & Live Visualizer (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Multilayer Stack Visualizer */}
            <DeviceStackVisualizer recipe={recipe} />

            {/* Results Card Container */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
              {/* Tab Selector: Results / SHAP / Backend Code */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('results')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'results'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Prediction & Uncertainty</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('shap')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'shap'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>SHAP Sensitivity</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('apiHook')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'apiHook'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>API Connect Hook</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400">
                  {result.executionTimeMs}ms inference
                </span>
              </div>

              {/* Tab Content 1: Main Results & Conformal Interval */}
              {activeTab === 'results' && (
                <div className="space-y-6">
                  {/* Hero Metric Gauge: Predicted PCE + 90% Conformal Range */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-xl bg-slate-950/90 border border-slate-800/90">
                    {/* SVG Radial Gauge */}
                    <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        {/* Track circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="8"
                        />
                        {/* Dynamic Progress circle */}
                        <circle
                          cx="60"
                          cy="60"
                          r="54"
                          fill="none"
                          stroke="url(#cyanGaugeGrad)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={gaugeCircumference}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-700 ease-out"
                        />
                        <defs>
                          <linearGradient id="cyanGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#22d3ee" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Inner Text Value */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-bold font-mono text-white tracking-tight">
                          {result.pce}%
                        </span>
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-medium">
                          PCE (AM1.5G)
                        </span>
                      </div>
                    </div>

                    {/* Conformal Prediction Interval & Certainty Spread */}
                    <div className="space-y-3 flex-1 w-full">
                      <div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-slate-400 uppercase tracking-wider">
                            90% Calibrated Conformal Interval
                          </span>
                          <span className="font-mono text-emerald-400 font-semibold text-xs">
                            MAPIE CQR
                          </span>
                        </div>
                        <div className="text-lg font-mono font-bold text-white mt-1">
                          [{result.lowerBoundPce}% — {result.upperBoundPce}% PCE]
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Certainty spread: ±{((result.upperBoundPce - result.lowerBoundPce) / 2).toFixed(2)}% absolute efficiency
                        </div>
                      </div>

                      {/* Visual Interval Bar */}
                      <div className="space-y-1">
                        <div className="relative w-full h-3 bg-slate-800/80 rounded-full overflow-hidden">
                          {/* Reference scale: 10% to 26% PCE */}
                          <div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500/80 to-emerald-400 rounded-full transition-all duration-500"
                            style={{
                              left: `${Math.max(0, ((result.lowerBoundPce - 10) / 16) * 100)}%`,
                              width: `${Math.min(100, Math.max(8, ((result.upperBoundPce - result.lowerBoundPce) / 16) * 100))}%`,
                            }}
                          />
                          {/* Point estimate indicator */}
                          <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-sm transition-all duration-500"
                            style={{
                              left: `${Math.max(0, Math.min(100, ((result.pce - 10) / 16) * 100))}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>10.0%</span>
                          <span>18.0%</span>
                          <span>26.0%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Intermediate Stage 1 Physics Properties (Voc, Jsc, FF) */}
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                      Stage 1 Predicted Electrical Diode Parameters
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-center">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Voc (Open-Circuit)</div>
                        <div className="text-lg font-bold font-mono text-white mt-1">
                          {result.voc} <span className="text-xs text-slate-400 font-normal">V</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Bandgap offset</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-center">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Jsc (Short-Circuit)</div>
                        <div className="text-lg font-bold font-mono text-cyan-300 mt-1">
                          {result.jsc} <span className="text-xs text-slate-400 font-normal">mA/cm²</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Optical harvest</div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-center">
                        <div className="text-[10px] font-mono uppercase text-slate-400">Fill Factor (FF)</div>
                        <div className="text-lg font-bold font-mono text-teal-300 mt-1">
                          {result.ff} <span className="text-xs text-slate-400 font-normal">%</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Mobility / Series R</div>
                      </div>
                    </div>
                  </div>

                  {/* Feasibility & Chemical Guardrails Verification */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Physical & Chemical Guardrails Verification
                    </div>
                    <div className="space-y-2 text-xs">
                      {/* Tolerance factor */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-slate-300">Goldschmidt Tolerance Factor:</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-medium">
                          t = {result.toleranceFactor} ({result.toleranceStatus})
                        </span>
                      </div>

                      {/* MA Thermal check */}
                      <div
                        className={`flex items-start justify-between p-2.5 rounded-lg border ${
                          result.maThermalPassed
                            ? 'bg-slate-950/60 border-slate-800 text-slate-300'
                            : 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {result.maThermalPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-medium">Methylammonium Thermal Check: </span>
                            <span className="text-slate-400 text-[11px] block sm:inline">
                              {result.maThermalNote}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`font-mono text-xs shrink-0 ml-2 font-semibold ${
                            result.maThermalPassed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {result.maThermalPassed ? 'PASSED' : 'WARNING'}
                        </span>
                      </div>

                      {/* Gower distance check */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                          <span className="text-slate-300">Gower Literature Support Distance:</span>
                        </div>
                        <span className="font-mono text-cyan-300 font-medium">
                          d = {result.gowerDistance} ({result.gowerStatus})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: SHAP Feature Attribution & Sensitivity Analysis via Recharts */}
              {activeTab === 'shap' && (
                <RecipeSensitivityChart recipe={recipe} result={result} />
              )}

              {/* Tab Content 3: Model Connectivity Hook */}
              {activeTab === 'apiHook' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-300 leading-relaxed">
                    Point the screening engine directly to your research lab’s self-hosted Python FastAPI backend or automated robotic cluster. Toggle below to route inference requests:
                  </div>

                  {/* Remote Hook Toggle */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-white flex items-center gap-2">
                        <span>Remote Model Server:</span>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {useRemoteApi ? 'Active' : 'Using Local Physics Simulator'}
                        </span>
                      </label>
                      <button
                        onClick={() => setUseRemoteApi(!useRemoteApi)}
                        className={`px-3 py-1 text-xs font-mono rounded-md border transition-colors ${
                          useRemoteApi
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        {useRemoteApi ? 'Disable Remote' : 'Enable Remote'}
                      </button>
                    </div>

                    {useRemoteApi && (
                      <div className="space-y-1.5 pt-1">
                        <label className="text-[11px] font-mono text-slate-400">Target Endpoint URL</label>
                        <input
                          type="text"
                          value={customApiUrl}
                          onChange={(e) => setCustomApiUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    )}
                  </div>

                  {/* Embedded Code Snippet */}
                  <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-[11px] overflow-x-auto text-slate-300 space-y-2">
                    <div className="text-slate-400">// BACKEND INTEGRATION HOOK (JavaScript / TypeScript):</div>
                    <div className="text-cyan-300 font-semibold">
                      async function callTrainedPerlaModel(recipePayload) &#123;
                    </div>
                    <div className="pl-4 text-slate-400">
                      const res = await fetch("{customApiUrl}", &#123;
                    </div>
                    <div className="pl-8 text-slate-400">method: "POST",</div>
                    <div className="pl-8 text-slate-400">headers: &#123; "Content-Type": "application/json" &#125;,</div>
                    <div className="pl-8 text-slate-400">body: JSON.stringify(recipePayload)</div>
                    <div className="pl-4 text-slate-400">&#125;);</div>
                    <div className="pl-4 text-emerald-300">return await res.json();</div>
                    <div className="text-cyan-300 font-semibold">&#125;</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
