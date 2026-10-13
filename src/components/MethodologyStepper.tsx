import React, { useState } from 'react';
import { Database, Binary, ShieldCheck, Cpu, Gauge, Compass, CheckCircle2 } from 'lucide-react';

interface Step {
  id: number;
  label: string;
  tag: string;
  icon: React.ReactNode;
  summary: string;
  details: {
    datasetSize?: string;
    method?: string;
    formula?: string;
    metrics?: string;
    bulletPoints: string[];
  };
}

export const MethodologyStepper: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: Step[] = [
    {
      id: 1,
      label: 'Literature Corpus Mining',
      tag: '34,862 Devices',
      icon: <Database className="w-4 h-4" />,
      summary: 'Automated data curation across published peer-reviewed perovskite solar cell literature.',
      details: {
        datasetSize: '34,862 verified devices extracted from 2,800+ peer-reviewed articles',
        method: 'Standardized ontology normalization for nip/pin configurations, chemical ratios, and JV scan protocols',
        bulletPoints: [
          'Resolves contradictory laboratory nomenclature for cation mixtures (FA, MA, Cs, Rb, Gu) and halides (I, Br, Cl).',
          'Harmonizes forward vs. reverse JV hysteresis scans under calibrated AM1.5G 100 mW/cm² irradiation.',
          'Prunes incomplete fabrication reporting (missing thicknesses, annealing durations, or anti-solvent recipes).',
        ],
      },
    },
    {
      id: 2,
      label: '18-D LHS Sampling',
      tag: 'Design Space',
      icon: <Binary className="w-4 h-4" />,
      summary: 'Latin Hypercube Sampling across an 18-dimensional continuous and discrete parameter manifold.',
      details: {
        method: 'Maximin Latin Hypercube Sampling (LHS) with space-filling criteria',
        metrics: '18 degrees of freedom: 5 composition fractions, 4 layer thicknesses, 3 annealing temperatures/times, 4 transport combinations, 2 substrate types',
        bulletPoints: [
          'Guarantees uniform orthogonal coverage across continuous variables (temperatures 70–160°C, thicknesses 200–650nm).',
          'Prevents combinatorial cluster bias common to standard grid searches or random sampling.',
          'Explores previously unsynthesized stoichiometric intermediate alloys beyond published benchmarks.',
        ],
      },
    },
    {
      id: 3,
      label: 'Physical Guardrails',
      tag: 'Zero Hallucinations',
      icon: <ShieldCheck className="w-4 h-4" />,
      summary: 'Strict crystallographic and thermodynamic rejection filters applied prior to model inference.',
      details: {
        formula: 'Goldschmidt Tolerance Factor: t = (r_A + r_X) / [ √2 · (r_B + r_X) ] ∈ [0.80, 1.05]',
        method: 'Shannon ionic radii validation + thermal decomposition limits + charge neutrality constraints',
        bulletPoints: [
          'Rejects distorted hexagonal or non-perovskite yellow phase combinations (t < 0.80 or t > 1.05).',
          'Rejects methylammonium (MA+) recipes annealed above 150 °C due to inevitable thermal volatilization into methylamine gas.',
          'Enforces realistic bench transport layer compatibility (e.g. self-assembled monolayers matched to inverted pin layouts).',
        ],
      },
    },
    {
      id: 4,
      label: '2-Stage Physics Predictor',
      tag: 'Voc, Jsc, FF → PCE',
      icon: <Cpu className="w-4 h-4" />,
      summary: 'Physics-decomposed ensemble predicting intermediate diode metrics before overall Power Conversion Efficiency.',
      details: {
        method: 'Stage 1: Multi-target HistGradientBoosting + ExtraTrees predicting Voc, Jsc, FF. Stage 2: Ensemble (XGBoost, RF) predicting PCE',
        formula: 'PCE_physical = (Voc · Jsc · FF) / Pin  where  Pin = 100 mW/cm²',
        metrics: 'Ensemble R² = 0.892, RMSE = 0.94% PCE across 5-fold cross-validation',
        bulletPoints: [
          'Decouples optical absorption (Jsc) from interfacial recombination (Voc) and series resistance carrier mobility (FF).',
          'Prevents non-physical "free-energy" predictions by anchoring PCE to fundamental photovoltaic conservation laws.',
          'Ensemble blending of gradient boosting and randomized trees dampens single-algorithm variance.',
        ],
      },
    },
    {
      id: 5,
      label: 'MAPIE Conformal Calibration',
      tag: '90% Coverage Guarantee',
      icon: <Gauge className="w-4 h-4" />,
      summary: 'Distribution-free conformal quantile regression providing guaranteed finite-sample uncertainty bounds.',
      details: {
        method: 'Conformalized Quantile Regression (CQR) via MAPIE on held-out calibration split',
        metrics: 'Empirical coverage: 90.7% on unseen test devices at nominal α = 0.10 significance level',
        bulletPoints: [
          'Unlike Gaussian assumptions, conformal intervals adapt dynamically to heteroscedastic noise in experimental data.',
          'Provides strict lower-bound efficiency guarantees so lab leaders know the worst-case yield of a candidate.',
          'Interval widths naturally widen when recipes probe less-explored experimental domains.',
        ],
      },
    },
    {
      id: 6,
      label: 'Gower Diversity Shortlist',
      tag: 'Bench-Ready',
      icon: <Compass className="w-4 h-4" />,
      summary: 'Multi-objective consensus ranking and pairwise distance filtering delivering bench-ready candidate shortlists.',
      details: {
        formula: 'Pairwise Gower Distance: S_Gower(x, y) = (1/p) ∑ s_k(x_k, y_k) ≥ 0.15',
        method: 'Pareto consensus optimization balancing expected PCE with lower-bound certainty',
        bulletPoints: [
          'Ensures candidates sent to the lab bench are chemically distinct, maximizing discovery value per experiment.',
          'Calculates support distance back to literature training instances to flag high-confidence vs. exploratory recipes.',
          'Generates machine-readable synthesis files directly compatible with automated lab dispensing robots.',
        ],
      },
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="methodology" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono tracking-wider uppercase text-cyan-400">
            Pipeline Architecture & Methodology
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            How PerovScreen Transforms Literature Data into Bench Discoveries
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A 6-stage scientific workflow that enforces strict thermodynamic laws, space-filling Latin Hypercube exploration, physics-informed 2-stage modeling, and rigorous conformal uncertainty quantification.
          </p>
        </div>

        {/* Stepper Navigation Strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((s, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(index)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase ${isActive ? 'text-cyan-400 font-bold' : 'text-slate-500'}`}>
                    Step 0{s.id}
                  </span>
                  <div className={isActive ? 'text-cyan-400' : 'text-slate-500'}>{s.icon}</div>
                </div>

                <div className="mt-3">
                  <div className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                    {s.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Deep-Dive Card */}
        <div className="p-7 sm:p-9 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span>Phase 0{current.id} of 06</span>
                <span>·</span>
                <span className="uppercase">{current.tag}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {current.label}
              </h3>
            </div>
            <div className="text-xs text-slate-400 max-w-sm">
              {current.summary}
            </div>
          </div>

          {/* Technical Specs Callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {current.details.datasetSize && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90">
                <span className="text-slate-400 text-[10px] uppercase block">Corpus Scale</span>
                <span className="text-cyan-300 font-medium">{current.details.datasetSize}</span>
              </div>
            )}
            {current.details.method && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90">
                <span className="text-slate-400 text-[10px] uppercase block">Methodology</span>
                <span className="text-teal-300 font-medium">{current.details.method}</span>
              </div>
            )}
            {current.details.formula && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 md:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase block">Governing Physical / Statistical Invariant</span>
                <span className="text-amber-300 font-medium overflow-x-auto block pt-0.5">{current.details.formula}</span>
              </div>
            )}
            {current.details.metrics && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 md:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase block">Empirical Metric Benchmarks</span>
                <span className="text-emerald-300 font-medium">{current.details.metrics}</span>
              </div>
            )}
          </div>

          {/* Bullet Points */}
          <div className="space-y-2.5 pt-2">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Key Scientific Implementations
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-300">
              {current.details.bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <p className="leading-relaxed">{bp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
