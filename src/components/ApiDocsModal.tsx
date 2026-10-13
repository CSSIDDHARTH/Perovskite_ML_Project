import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Globe } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeSnippet, setActiveSnippet] = useState<'python' | 'curl' | 'typescript'>('python');

  if (!isOpen) return null;

  const pythonSnippet = `# Example Python client request to PerovScreen API
import requests

ENDPOINT = "http://localhost:8000/api/predict"

recipe_payload = {
    "architecture": "nip",
    "composition": "Triple-Cation (Cs/FA/MA)",
    "annealTemp": 100,
    "annealTime": 35,
    "layerThickness": 450,
    "etlRecipe": "SnO2 (spin-coated)",
    "htlRecipe": "Spiro-OMeTAD",
    "substrate": "SLG | FTO"
}

response = requests.post(ENDPOINT, json=recipe_payload)
result = response.json()

print(f"Predicted PCE: {result['pce']}%")
print(f"90% Conformal Range: [{result['lowerBoundPce']}% - {result['upperBoundPce']}%]")
print(f"Intermediate Physics: Voc={result['voc']}V, Jsc={result['jsc']}mA, FF={result['ff']}%")
print(f"Goldschmidt Tolerance: t={result['toleranceFactor']} ({result['toleranceStatus']})")
`;

  const curlSnippet = `curl -X POST "http://localhost:8000/api/predict" \\
  -H "Content-Type: application/json" \\
  -d '{
    "architecture": "pin",
    "composition": "FA-Cs-Pb-I-Br",
    "annealTemp": 120,
    "annealTime": 20,
    "layerThickness": 500,
    "etlRecipe": "C60 / BCP",
    "htlRecipe": "2PACz",
    "substrate": "SLG | ITO"
  }'`;

  const tsSnippet = `// TypeScript / Node.js automated screening script
interface RecipePayload {
  architecture: 'nip' | 'pin';
  composition: string;
  annealTemp: number;
  annealTime: number;
  layerThickness: number;
  etlRecipe: string;
  htlRecipe: string;
  substrate: string;
}

async function screenSolarCell(recipe: RecipePayload) {
  const res = await fetch("http://localhost:8000/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(recipe),
  });
  const data = await res.json();
  return data;
}`;

  const currentCode =
    activeSnippet === 'python'
      ? pythonSnippet
      : activeSnippet === 'curl'
      ? curlSnippet
      : tsSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedTab(activeSnippet);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Documentation & Automated Lab Integration</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
            Connect Lab Robots & Python Pipelines to PerovScreen
          </h3>
          <p className="text-xs text-slate-300">
            Automate high-throughput synthesis screening by directly piping proposed compositions into our REST API.
          </p>
        </div>

        {/* Tab switch for code snippets */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSnippet('python')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeSnippet === 'python'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python (requests)
            </button>
            <button
              onClick={() => setActiveSnippet('curl')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeSnippet === 'curl'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL CLI
            </button>
            <button
              onClick={() => setActiveSnippet('typescript')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors ${
                activeSnippet === 'typescript'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TypeScript / Node
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedTab === activeSnippet ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code Display Box */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-slate-200 leading-relaxed">
          <pre>{currentCode}</pre>
        </div>

        {/* JSON Response Schema Preview */}
        <div className="space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Expected JSON Output Schema
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
            <pre>
{`{
  "pce": 23.6,
  "lowerBoundPce": 22.4,
  "upperBoundPce": 24.5,
  "voc": 1.185,
  "jsc": 24.8,
  "ff": 80.6,
  "toleranceFactor": 0.985,
  "toleranceStatus": "Optimal (Cubic)",
  "maThermalPassed": true,
  "gowerDistance": 0.065,
  "gowerStatus": "High Support"
}`}
            </pre>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
