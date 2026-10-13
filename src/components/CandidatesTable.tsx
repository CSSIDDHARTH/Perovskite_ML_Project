import React, { useState, useMemo } from 'react';
import { ConsensusCandidate, RecipeInput } from '../types';
import { CONSENSUS_CANDIDATES, exportCandidatesToCsv } from '../data/consensusCandidates';
import {
  Download,
  Search,
  SlidersHorizontal,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
  ArrowUpDown,
  Layers,
  Thermometer,
  Clock,
  FlaskConical,
} from 'lucide-react';

interface CandidatesTableProps {
  onSelectCandidateForEvaluator: (candidate: RecipeInput) => void;
}

export const CandidatesTable: React.FC<CandidatesTableProps> = ({
  onSelectCandidateForEvaluator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [archFilter, setArchFilter] = useState<'all' | 'nip' | 'pin'>('all');
  const [minPce, setMinPce] = useState<number>(20.0);
  const [sortBy, setSortBy] = useState<'rank' | 'pce' | 'support' | 'temp'>('rank');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [selectedCandidate, setSelectedCandidate] = useState<ConsensusCandidate | null>(null);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    return CONSENSUS_CANDIDATES.filter((item) => {
      // Architecture filter
      if (archFilter !== 'all' && item.architecture !== archFilter) return false;
      // Min PCE
      if (item.predictedPce < minPce) return false;
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesComp = item.composition.toLowerCase().includes(query);
        const matchesId = item.id.toLowerCase().includes(query);
        const matchesEtl = item.etlRecipe.toLowerCase().includes(query);
        const matchesHtl = item.htlRecipe.toLowerCase().includes(query);
        const matchesNotes = item.synthesisNotes.toLowerCase().includes(query);
        return matchesComp || matchesId || matchesEtl || matchesHtl || matchesNotes;
      }
      return true;
    }).sort((a, b) => {
      let valA: number = a.rank;
      let valB: number = b.rank;
      if (sortBy === 'pce') {
        valA = a.predictedPce;
        valB = b.predictedPce;
      } else if (sortBy === 'support') {
        valA = a.supportPercentile;
        valB = b.supportPercentile;
      } else if (sortBy === 'temp') {
        valA = a.annealTemp;
        valB = b.annealTemp;
      }
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [searchQuery, archFilter, minPce, sortBy, sortAsc]);

  const handleDownloadCsv = () => {
    const csvContent = exportCandidatesToCsv(filteredCandidates);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lhs_consensus_candidates_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToggleSort = (column: 'rank' | 'pce' | 'support' | 'temp') => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(column === 'rank');
    }
  };

  const handleLoadIntoEvaluator = (cand: ConsensusCandidate) => {
    onSelectCandidateForEvaluator({
      architecture: cand.architecture,
      composition: cand.composition.includes('Triple')
        ? 'Triple-Cation (Cs/FA/MA)'
        : cand.composition.includes('MAPbI3')
        ? 'MAPbI3'
        : cand.composition.includes('CsPbI3')
        ? 'CsPbI3'
        : cand.composition.includes('FA') && cand.composition.includes('Cs') && !cand.composition.includes('MA')
        ? 'FA-Cs-Pb-I-Br'
        : 'Cs-FA-MA-Pb-I-Br',
      annealTemp: cand.annealTemp,
      annealTime: cand.annealTime,
      layerThickness: cand.layerThickness,
      etlRecipe: cand.etlRecipe,
      htlRecipe: cand.htlRecipe,
      substrate: cand.substrate,
    });
    // Smooth scroll to evaluator
    document.getElementById('evaluator')?.scrollIntoView({ behavior: 'smooth' });
    setSelectedCandidate(null);
  };

  return (
    <section id="recommendations" className="py-20 border-b border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-mono tracking-wider uppercase text-cyan-400">
              Inverse Design Exploration · LHS Consensus Frontier
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
              Top Recommended Candidates Showcase
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl">
              Ranked, physically vetted candidate recipes generated via 18-dimensional Latin Hypercube Sampling (LHS). Filtered with Gower diversity threshold (≥ 0.15) to guarantee laboratory novelty and minimize material trial cost.
            </p>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all flex items-center gap-2 whitespace-nowrap self-start md:self-auto cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Candidates (CSV)</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search composition, ETL, HTL, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Architecture Tabs */}
            <div className="md:col-span-3 flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setArchFilter('all')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                  archFilter === 'all'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Stacks
              </button>
              <button
                onClick={() => setArchFilter('nip')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                  archFilter === 'nip'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                nip (regular)
              </button>
              <button
                onClick={() => setArchFilter('pin')}
                className={`flex-1 py-1 text-xs font-medium rounded transition-colors ${
                  archFilter === 'pin'
                    ? 'bg-slate-800 text-teal-400 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                pin (inverted)
              </button>
            </div>

            {/* Min PCE Filter */}
            <div className="md:col-span-4 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                Min PCE: <strong className="text-white">{minPce}%</strong>
              </span>
              <input
                type="range"
                min={18.0}
                max={23.5}
                step={0.5}
                value={minPce}
                onChange={(e) => setMinPce(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-950 rounded appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div>
              Showing <span className="font-mono text-cyan-400 font-semibold">{filteredCandidates.length}</span> of{' '}
              <span className="font-mono">{CONSENSUS_CANDIDATES.length}</span> consensus formulations
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Pairwise Gower: ≥ 0.15</span>
              <span>·</span>
              <span>Tolerance Factor: 0.82–1.04</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th
                    onClick={() => handleToggleSort('rank')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Rank</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Architecture</th>
                  <th className="py-3.5 px-4">Perovskite Composition</th>
                  <th
                    onClick={() => handleToggleSort('temp')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Anneal Profile</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleToggleSort('pce')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1 text-cyan-400">
                      <span>Predicted PCE</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">90% Conformal Interval</th>
                  <th
                    onClick={() => handleToggleSort('support')}
                    className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Support</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Feasibility</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                      No candidate recipes match your current search and filters.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((cand) => (
                    <tr
                      key={cand.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCandidate(cand)}
                    >
                      {/* Rank & ID */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-white">#{cand.rank}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{cand.id}</span>
                      </td>

                      {/* Architecture */}
                      <td className="py-3.5 px-4 font-mono">
                        <span
                          className={`font-semibold ${
                            cand.architecture === 'nip' ? 'text-cyan-400' : 'text-teal-400'
                          }`}
                        >
                          {cand.architecture.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {cand.architecture === 'nip' ? 'Regular' : 'Inverted'}
                        </span>
                      </td>

                      {/* Composition */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white max-w-[220px] truncate" title={cand.composition}>
                          {cand.composition}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cand.etlRecipe.split(' ')[0]} / {cand.htlRecipe.split(' ')[0]}
                        </div>
                      </td>

                      {/* Anneal Profile */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>{cand.annealTemp} °C · {cand.annealTime} min</div>
                        <div className="text-slate-400">{cand.layerThickness} nm active</div>
                      </td>

                      {/* Predicted PCE */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-base font-bold text-cyan-300 tabular-nums">
                          {cand.predictedPce.toFixed(1)}%
                        </span>
                      </td>

                      {/* 90% Conformal Interval */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-slate-200">
                          [{cand.conformalLower.toFixed(1)}% — {cand.conformalUpper.toFixed(1)}%]
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Δ = ±{((cand.conformalUpper - cand.conformalLower) / 2).toFixed(1)}%
                        </span>
                      </td>

                      {/* Support Percentile */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-emerald-400 font-semibold">{cand.supportPercentile}th</span>
                        <span className="text-slate-400 text-[10px] block">d = {cand.gowerDistance}</span>
                      </td>

                      {/* Feasibility */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-300 font-medium">
                          {cand.labFeasibility}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandidate(cand);
                          }}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Detail Modal / Drawer */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <span>Candidate Rank #{selectedCandidate.rank}</span>
                  <span>·</span>
                  <span>{selectedCandidate.id}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                  {selectedCandidate.composition}
                </h3>
              </div>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Predicted PCE</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                    {selectedCandidate.predictedPce}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">90% Conformal Range</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    [{selectedCandidate.conformalLower}% — {selectedCandidate.conformalUpper}%]
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Voc / Jsc / FF</div>
                  <div className="text-xs font-mono text-slate-200 mt-1">
                    {selectedCandidate.voc}V · {selectedCandidate.jsc}mA · {selectedCandidate.ff}%
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Support Distance</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                    {selectedCandidate.supportPercentile}th (%ile)
                  </div>
                </div>
              </div>

              {/* Complete Stack Formulation Table */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Laboratory Fabrication Parameters
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Architecture</span>
                    <span className="font-semibold text-white">{selectedCandidate.architecture.toUpperCase()} (Standard)</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Substrate</span>
                    <span className="font-semibold text-white">{selectedCandidate.substrate}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Electron Transport (ETL)</span>
                    <span className="font-semibold text-cyan-300">{selectedCandidate.etlRecipe}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Hole Transport (HTL)</span>
                    <span className="font-semibold text-teal-300">{selectedCandidate.htlRecipe}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Thermal Annealing</span>
                    <span className="font-semibold text-white">{selectedCandidate.annealTemp} °C for {selectedCandidate.annealTime} min</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Absorber Thickness</span>
                    <span className="font-semibold text-white">{selectedCandidate.layerThickness} nm</span>
                  </div>
                </div>
              </div>

              {/* Bench Synthesis Notes */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-xs font-mono uppercase text-cyan-400 flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Experimental Bench Notes & Antisolvent Guidance</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCandidate.synthesisNotes}
                </p>
              </div>

              {/* Modal CTAs */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleLoadIntoEvaluator(selectedCandidate)}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-sm shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Load into Recipe Evaluator</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
