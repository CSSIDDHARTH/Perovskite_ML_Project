import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  Legend,
  Cell,
} from 'recharts';
import { RecipeInput, EvaluationResult } from '../types';
import { computePhysicsInformedPrediction } from '../lib/modelSimulator';
import { Sliders, TrendingUp, BarChart3, Info } from 'lucide-react';

interface RecipeSensitivityChartProps {
  recipe: RecipeInput;
  result: EvaluationResult;
}

type SensitivityMode = 'sweep' | 'shap_bar' | 'all_features';

export const RecipeSensitivityChart: React.FC<RecipeSensitivityChartProps> = ({
  recipe,
  result,
}) => {
  const [mode, setMode] = useState<SensitivityMode>('sweep');
  const [sweepFeature, setSweepFeature] = useState<'temp' | 'time' | 'thick'>('temp');

  // Generate 1D sensitivity curves around current recipe parameters
  const tempSweepData = useMemo(() => {
    const points = [];
    for (let t = 70; t <= 160; t += 5) {
      const sim = computePhysicsInformedPrediction({ ...recipe, annealTemp: t });
      points.push({
        param: t,
        pce: sim.pce,
        voc: sim.voc,
        jsc: sim.jsc,
        ff: sim.ff,
        isCurrent: Math.abs(t - recipe.annealTemp) < 3,
      });
    }
    return points;
  }, [recipe]);

  const timeSweepData = useMemo(() => {
    const points = [];
    for (let m = 2; m <= 60; m += 2) {
      const sim = computePhysicsInformedPrediction({ ...recipe, annealTime: m });
      points.push({
        param: m,
        pce: sim.pce,
        voc: sim.voc,
        jsc: sim.jsc,
        ff: sim.ff,
        isCurrent: Math.abs(m - recipe.annealTime) < 1.5,
      });
    }
    return points;
  }, [recipe]);

  const thickSweepData = useMemo(() => {
    const points = [];
    for (let th = 200; th <= 650; th += 25) {
      const sim = computePhysicsInformedPrediction({ ...recipe, layerThickness: th });
      points.push({
        param: th,
        pce: sim.pce,
        voc: sim.voc,
        jsc: sim.jsc,
        ff: sim.ff,
        isCurrent: Math.abs(th - recipe.layerThickness) < 15,
      });
    }
    return points;
  }, [recipe]);

  // SHAP Feature Impact data for horizontal bar visualization
  const shapBarData = useMemo(() => {
    return result.shapFactors.map((item) => ({
      feature: item.feature.length > 24 ? item.feature.slice(0, 22) + '...' : item.feature,
      fullName: item.feature,
      impact: item.impact,
      description: item.description,
    }));
  }, [result.shapFactors]);

  // Active sweep dataset selection
  const activeSweep = useMemo(() => {
    if (sweepFeature === 'temp') {
      return {
        data: tempSweepData,
        xLabel: 'Annealing Temperature (°C)',
        unit: '°C',
        currentVal: recipe.annealTemp,
        domain: [70, 160],
        insight:
          'Optimal crystallization kinetics occurs near 100–115 °C. Rapid thermal degradation starts at >150 °C for MA-containing perovskites.',
        hasWarningZone: recipe.composition.includes('MA'),
        warningStart: 150,
      };
    } else if (sweepFeature === 'time') {
      return {
        data: timeSweepData,
        xLabel: 'Annealing Duration (min)',
        unit: 'min',
        currentVal: recipe.annealTime,
        domain: [2, 60],
        insight:
          'Extended annealing beyond 45 min yields diminishing returns and potential solvent-induced halide segregation.',
        hasWarningZone: false,
        warningStart: 60,
      };
    } else {
      return {
        data: thickSweepData,
        xLabel: 'Absorber Thickness (nm)',
        unit: 'nm',
        currentVal: recipe.layerThickness,
        domain: [200, 650],
        insight:
          'Thickness <300nm suffers from optical under-absorption; thickness >550nm leads to charge carrier recombination and series resistance.',
        hasWarningZone: false,
        warningStart: 650,
      };
    }
  }, [sweepFeature, tempSweepData, timeSweepData, thickSweepData, recipe]);

  return (
    <div className="space-y-4">
      {/* Sub-header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>SHAP & Partial Dependence Sensitivity Analysis</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Inspect marginal efficiency response as individual fabrication parameters are modulated.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setMode('sweep')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mode === 'sweep'
                ? 'bg-slate-800 text-cyan-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Response Curves
          </button>
          <button
            onClick={() => setMode('shap_bar')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              mode === 'shap_bar'
                ? 'bg-slate-800 text-teal-400 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SHAP Attribution
          </button>
        </div>
      </div>

      {mode === 'sweep' && (
        <div className="space-y-3">
          {/* Feature Selector Tabs for Sweeps */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px] font-mono">Sweep Variable:</span>
              <button
                onClick={() => setSweepFeature('temp')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  sweepFeature === 'temp'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Temperature (°C)
              </button>
              <button
                onClick={() => setSweepFeature('time')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  sweepFeature === 'time'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Time (min)
              </button>
              <button
                onClick={() => setSweepFeature('thick')}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  sweepFeature === 'thick'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                Thickness (nm)
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Current Operating Point: <strong className="text-cyan-300">{activeSweep.currentVal} {activeSweep.unit}</strong>
            </div>
          </div>

          {/* Recharts LineChart for Sensitivity Curve */}
          <div className="w-full h-64 bg-slate-950/90 rounded-xl p-3 border border-slate-800/90">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeSweep.data}
                margin={{ top: 12, right: 18, left: -14, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="param"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit={activeSweep.unit === '°C' ? '°' : ''}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  unit="%"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1">
                          <div className="text-slate-400 font-semibold">
                            {activeSweep.xLabel}: <span className="text-white">{data.param} {activeSweep.unit}</span>
                          </div>
                          <div className="text-cyan-300 font-bold">
                            Predicted PCE: {data.pce}%
                          </div>
                          <div className="text-slate-400 text-[10px]">
                            Voc: {data.voc}V · Jsc: {data.jsc}mA · FF: {data.ff}%
                          </div>
                          {data.isCurrent && (
                            <div className="text-[10px] text-emerald-400 font-semibold">
                              ● Current Evaluator Recipe
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Warning zone for high temperature */}
                {activeSweep.hasWarningZone && (
                  <ReferenceArea
                    x1={150}
                    x2={160}
                    fill="#ef4444"
                    fillOpacity={0.12}
                    strokeOpacity={0.3}
                  />
                )}

                {/* Reference line at current recipe value */}
                <ReferenceLine
                  x={activeSweep.currentVal}
                  stroke="#22d3ee"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Current (${activeSweep.currentVal})`,
                    fill: '#22d3ee',
                    fontSize: 10,
                    position: 'top',
                  }}
                />

                {/* Primary PCE Line */}
                <Line
                  type="monotone"
                  dataKey="pce"
                  name="Predicted PCE (%)"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: '#06b6d4' }}
                  activeDot={{ r: 5, fill: '#22d3ee', stroke: '#fff', strokeWidth: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Scientific Context Note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-300">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white font-medium">Domain Insight:</strong> {activeSweep.insight}
            </p>
          </div>
        </div>
      )}

      {mode === 'shap_bar' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Marginal Efficiency Attribution (Δ% PCE)</span>
            <span className="font-mono text-cyan-400">TreeSHAP Values</span>
          </div>

          {/* Recharts BarChart for SHAP attributions */}
          <div className="w-full h-64 bg-slate-950/90 rounded-xl p-3 border border-slate-800/90">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shapBarData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 10, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                />
                <YAxis
                  dataKey="feature"
                  type="category"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const isPositive = data.impact >= 0;
                      return (
                        <div className="bg-slate-900 border border-slate-700/80 p-2.5 rounded-lg shadow-xl text-xs font-mono space-y-1 max-w-[260px]">
                          <div className="text-white font-semibold">{data.fullName}</div>
                          <div
                            className={`font-bold ${
                              isPositive ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            SHAP Contribution: {isPositive ? `+${data.impact}%` : `${data.impact}%`} PCE
                          </div>
                          <div className="text-slate-400 text-[10px] leading-normal">
                            {data.description}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
                <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                  {shapBarData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.impact >= 0 ? '#10b981' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
              <span>Positive Efficiency Driver (+Δ% PCE)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
              <span>Recombination / Resistance Penalty (-Δ% PCE)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
