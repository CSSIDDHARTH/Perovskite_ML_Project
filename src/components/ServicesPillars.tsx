import React from 'react';
import { Compass, Cpu, ShieldCheck, Gauge, Eye, MapPin, ArrowRight } from 'lucide-react';
import latticeImage from '../assets/images/perla_materials_lattice_1791887754408.jpg';

export const ServicesPillars: React.FC = () => {
  return (
    <section id="services" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="text-xs font-mono tracking-wider uppercase text-cyan-400">
            Platform Capabilities & Core Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Inverse Design & Forward Screening Engines
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            PerovScreen flips conventional trial-and-error materials research on its head. Instead of asking only how a single recipe performs, our system searches billions of combinatorial candidates and bounds the experimental risk before you mix chemicals in the glovebox.
          </p>
        </div>

        {/* 2 Primary Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service 1: Inverse Design & Discovery */}
          <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>

              <div>
                <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
                  Service 01 · Inverse Discovery
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                  Candidate Recipe Recommendation & Discovery
                </h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Explore high-probability solar cell recipes sampled across an 18-dimensional continuous and categorical parameter space. PerovScreen uses multi-strategy consensus ranking that balances expected Power Conversion Efficiency (PCE) against conformal lower-bound certainty.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">Gower Diversity Filtering (≥ 0.15):</strong> Eliminates duplicate formulations and broadens the experimental search frontier across distinct chemical families.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">Consensus Frontier Ranking:</strong> Reconciles optimist vs. conservative criteria so experimentalists avoid brittle "high-variance" traps.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">One-Click Synthesis Protocols:</strong> Direct export of complete deposition parameters (spin curves, annealing, thicknesses).
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              <a
                href="#recommendations"
                className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Browse Precomputed Consensus Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Service 2: Interactive Recipe Evaluator & Screening */}
          <div className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-xl">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>

              <div>
                <div className="text-xs font-mono text-teal-400 tracking-wider uppercase">
                  Service 02 · Forward Screening & UQ
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                  Interactive Recipe Evaluator & Screening
                </h3>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Test bespoke hypothesis recipes before entering the cleanroom. Input layer stacks, annealing temperatures, durations, and active layer thicknesses to receive instantaneous physics predictions with statistical coverage bounds.
              </p>

              <div className="space-y-3 pt-2 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">2-Stage Physics Decomposition:</strong> Stage 1 extracts Voc, Jsc, and FF, which feed the Stage 2 PCE ensemble (HistGradientBoosting, XGBoost, ExtraTrees).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">Dynamic Stack Visualization:</strong> Real-time cross-section rendering reflecting your exact material layers and thickness choices.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>
                    <strong className="text-white font-medium">Automatic Guardrail Enforcement:</strong> Proactively warns if methylammonium thermal thresholds or lattice distortion limits are breached.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              <a
                href="#evaluator"
                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                <span>Launch Interactive Screening Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 4 Scientific Trust Pillars with Perovskite Crystal Lattice Backdrop */}
        <div className="pt-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Reliability & Scientific Rigor
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mt-1">
                4 Scientific Trust Pillars
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Unlike black-box generative models that can hallucinate non-physical materials, PerovScreen is strictly constrained by thermodynamics, crystallography, and rigorous uncertainty calibration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1: Guardrails */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Physical & Chemical Guardrails</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated rejection of unfeasible combinations before inference: Goldschmidt tolerance factor checks (0.80–1.05), methylammonium thermal limits (&lt; 150 °C), and cation stoichiometry balancing.
              </p>
            </div>

            {/* Pillar 2: MAPIE Conformal Uncertainty */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Calibrated Uncertainty (MAPIE)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Conformal Quantile Regression (CQR) provides true 90% empirical coverage intervals. Scientists know the lower-bound worst-case performance rather than relying on misleading single-number estimates.
              </p>
            </div>

            {/* Pillar 3: SHAP Interpretability */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Interpretability & Sensitivity (SHAP)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Local TreeSHAP attributions reveal exactly why a recipe excels or fails. Inspect the quantitative marginal contribution of thickness, anneal profile, and transport band alignment.
              </p>
            </div>

            {/* Pillar 4: Gower Literature Grounding */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Literature Grounding (Gower Distance)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Multivariate distance metric calculates empirical proximity to 34,862 real published devices. Flags if a proposed formulation ventures into unverified extrapolation domains.
              </p>
            </div>
          </div>

          {/* Educational Callout with Crystal Lattice Visual */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 aspect-[4/3] bg-slate-950 overflow-hidden">
              <img
                src={latticeImage}
                alt="Cubic Perovskite ABX3 Crystal Lattice showing lead halide octahedra and organic cations"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Crystallographic Foundation · ABX3 Perovskite Physics
              </div>
              <h4 className="text-xl font-bold font-heading text-white">
                Goldschmidt Tolerance Factor & Octahedral Factor Constraints
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The stability of the perovskite lattice is governed by the structural ratio:
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                t = (r_A + r_X) / [ √2 · (r_B + r_X) ] &nbsp;&nbsp;&nbsp;&nbsp;[0.80 ≤ t ≤ 1.05]
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Where r_A is the effective ionic radius of organic/inorganic cations (Cs⁺, MA⁺, FA⁺), r_B is the divalent metal (Pb²⁺), and r_X is the halide anion (I⁻, Br⁻). PerovScreen computes the precise composition-weighted tolerance factor for every single candidate, pruning non-perovskite yellow phase mixtures before model inference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
