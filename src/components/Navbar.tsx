import React from 'react';
import { Sparkles, Terminal, Code2, Download } from 'lucide-react';

interface NavbarProps {
  onOpenApiModal: () => void;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApiModal, onOpenExportModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark with domain mark */}
        <a href="#overview" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-sm group-hover:scale-105 transition-transform font-mono">
            PS
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white font-heading">
              PerovScreen
            </span>
            <span className="text-[10px] tracking-wider uppercase font-mono text-cyan-400/80 -mt-1 hidden sm:block">
              Perovskite ML Architecture
            </span>
          </div>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#overview"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Overview
          </a>
          <a
            href="#services"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Services
          </a>
          <a
            href="#evaluator"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Recipe Evaluator
          </a>
          <a
            href="#recommendations"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Top Recommendations
          </a>
          <a
            href="#methodology"
            className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
          >
            Methodology
          </a>
        </nav>

        {/* Zone 3: 1 Primary action + secondary tool toggles */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenApiModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-md transition-colors whitespace-nowrap"
            title="Model API & Integration Code"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>API Connect</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-md transition-colors whitespace-nowrap"
            title="Download Standalone Single-File HTML"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            <span>Export HTML</span>
          </button>

          <a
            href="#evaluator"
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Evaluate a Recipe</span>
          </a>
        </div>
      </div>
    </header>
  );
};
