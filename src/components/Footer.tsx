import React from 'react';
import { AlertCircle, BookOpen, GitFork, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/[0.08] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 7: Scientific Disclaimer & Responsible ML Note Banner */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Scientific Disclaimer & Responsible ML Practice
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <strong>Important Research Note:</strong> All candidate outputs are model proposals intended to prioritize laboratory screening and reduce material waste. They represent probabilistic hypotheses, not absolute experimental guarantees. Always review the calibrated uncertainty intervals and support metrics.
            </p>
          </div>
        </div>

        {/* Footer Main Links & Citations */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs font-mono">
                PS
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-heading">
                PerovScreen
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Perovskite Solar Cell Discovery & Screening Platform. Accelerating photovoltaic synthesis through 18-D Latin Hypercube exploration, physics-grounded ensembles, and calibrated conformal uncertainty.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Open Science</span>
              <span>·</span>
              <span>Literature Corpus: 34,862 Cells</span>
              <span>·</span>
              <span>MAPIE CQR</span>
            </div>
          </div>

          {/* Dataset & Literature Citations */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dataset & Literature Citations</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="leading-relaxed">
                <span className="text-slate-200">The Perovskite Database Project:</span> Jacobsson et al., Nature Energy (2022). Mining & FAIR benchmarking.
              </li>
              <li className="leading-relaxed">
                <span className="text-slate-200">MAPIE Framework:</span> Taquet et al., Model Agnostic Prediction Interval Estimator (scikit-learn-contrib).
              </li>
              <li className="leading-relaxed">
                <span className="text-slate-200">Goldschmidt Tolerance Analysis:</span> Travis et al., Chem. Sci. (2016). Octahedral tilt and phase boundary mapping.
              </li>
            </ul>
          </div>

          {/* Research Collaboration & GitHub */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-teal-400" />
              <span>Lab Collaboration</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interested in bench-validating recommended candidate recipes or contributing experimental data?
            </p>
            <div className="space-y-2 pt-1 text-xs font-mono">
              <a
                href="mailto:research@perovscreen.org"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <span>research@perovscreen.org</span>
              </a>
              <a
                href="https://github.com/perovscreen/solar-discovery"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <GitFork className="w-3 h-3" />
                <span>github.com/perovscreen/solar-discovery</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} PerovScreen Initiative. Published for Academic & Industrial Renewable Energy Research.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>License: Apache 2.0</span>
            <span>·</span>
            <span>Privacy & Data Sovereignty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
