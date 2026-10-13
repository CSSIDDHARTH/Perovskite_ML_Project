export type DeviceArchitecture = 'nip' | 'pin';

export type PerovskiteComposition =
  | 'Cs-FA-MA-Pb-I-Br'
  | 'FA-Cs-Pb-I-Br'
  | 'MAPbI3'
  | 'CsPbI3'
  | 'Triple-Cation (Cs/FA/MA)';

export type ETLRecipe =
  | 'SnO2 (spin-coated)'
  | 'TiO2 (compact+mesoporous)'
  | 'C60 / BCP'
  | 'ZnO';

export type HTLRecipe =
  | 'Spiro-OMeTAD'
  | 'PTAA'
  | 'NiOx (nanoparticle)'
  | '2PACz';

export type SubstrateType = 'SLG | FTO' | 'SLG | ITO';

export interface RecipeInput {
  architecture: DeviceArchitecture;
  composition: PerovskiteComposition;
  annealTemp: number; // 70 - 160 °C
  annealTime: number; // 2 - 60 min
  layerThickness: number; // 200 - 650 nm
  etlRecipe: ETLRecipe;
  htlRecipe: HTLRecipe;
  substrate: SubstrateType;
}

export interface ShapFactor {
  feature: string;
  impact: number; // e.g. +1.42 or -0.65 (% PCE)
  description: string;
}

export interface EvaluationResult {
  pce: number; // %
  lowerBoundPce: number; // 90% CI lower
  upperBoundPce: number; // 90% CI upper
  voc: number; // V
  jsc: number; // mA/cm²
  ff: number; // %
  toleranceFactor: number;
  toleranceStatus: 'Optimal (Cubic)' | 'Stable (Tetragonal)' | 'Boundary Phase Risk' | 'Distorted Lattice';
  maThermalPassed: boolean;
  maThermalNote: string;
  gowerDistance: number;
  gowerStatus: 'High Support' | 'Moderate Support' | 'Low Support (Extrapolating)';
  shapFactors: ShapFactor[];
  executionTimeMs: number;
}

export interface ConsensusCandidate {
  rank: number;
  id: string;
  architecture: DeviceArchitecture;
  composition: string;
  annealTemp: number;
  annealTime: number;
  layerThickness: number;
  etlRecipe: ETLRecipe;
  htlRecipe: HTLRecipe;
  substrate: SubstrateType;
  predictedPce: number;
  conformalLower: number;
  conformalUpper: number;
  voc: number;
  jsc: number;
  ff: number;
  supportPercentile: number;
  gowerDistance: number;
  labFeasibility: 'High' | 'Moderate' | 'Very High (Benchmark)';
  synthesisNotes: string;
}
