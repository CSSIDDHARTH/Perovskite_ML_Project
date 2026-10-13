import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Cpu, Database, Layers } from 'lucide-react';
import heroImage from '../assets/images/perla_solar_cell_hero_1791887754777.jpg';

export const Hero: React.FC = () => {
  return (
    <section id="overview" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-white/[0.08]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission, Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="tracking-wider uppercase">Materials Informatics & Discovery</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Literature-Mined Ensemble</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">MAPIE CQR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.12] text-balance">
              AI-Guided Recommendation for Next-Generation{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Perovskite Solar Cells
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Stop relying on slow, expensive trial-and-error laboratory synthesis.
              Screen billions of design combinations with physics-grounded machine learning,
              rigorous chemical guardrails, and calibrated uncertainty quantification.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#recommendations"
                className="px-6 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Recommended Candidates</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#evaluator"
                className="px-6 py-3 text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/40 rounded-lg transition-all flex items-center gap-2"
              >
                <span>Evaluate Custom Recipe</span>
              </a>
            </div>

            {/* Micro scientific features */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Goldschmidt Tolerance Filtering</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>nip / pin Device Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Gower Support Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Scientific Cross-Section Render */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-2xl group">
              <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={heroImage}
                  alt="High-resolution scientific cross-section of perovskite solar cell multilayer stack showing TCO, ETL, Perovskite absorber, and HTL"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>

              {/* Caption overlay banner */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-mono text-slate-300 font-medium">Multilayer Thin-Film Cross Section</span>
                  </div>
                  <span className="font-mono text-cyan-400/80">AM1.5G 100 mW/cm²</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Inverse design optimizes carrier diffusion length, interface band offsets, and crystallization kinetics simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Ribbon (4 metric cards in full-width row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-8 border-t border-white/[0.08]">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Training Corpus</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-1">
              34,862
            </div>
            <div className="text-xs text-slate-400 mt-1">Literature Devices Extracted</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Exploration Matrix</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
              18-D
            </div>
            <div className="text-xs text-slate-400 mt-1">Latin Hypercube Sampling (LHS)</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Uncertainty Coverage</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
              90.7 %
            </div>
            <div className="text-xs text-slate-400 mt-1">MAPIE Conformal Guarantee</div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">Predictive Engine</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-teal-400 mt-1">
              2-Stage
            </div>
            <div className="text-xs text-slate-400 mt-1">Voc, Jsc, FF → PCE Ensemble</div>
          </div>
        </div>
      </div>
    </section>
  );
};
