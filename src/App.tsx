import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesPillars } from './components/ServicesPillars';
import { RecipeEvaluator } from './components/RecipeEvaluator';
import { CandidatesTable } from './components/CandidatesTable';
import { MethodologyStepper } from './components/MethodologyStepper';
import { ApiDocsModal } from './components/ApiDocsModal';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { Footer } from './components/Footer';
import { RecipeInput } from './types';

export default function App() {
  const [selectedCandidateRecipe, setSelectedCandidateRecipe] = useState<RecipeInput | undefined>(undefined);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const handleSelectCandidate = (candidate: RecipeInput) => {
    setSelectedCandidateRecipe(candidate);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* 1. Navigation Bar */}
      <Navbar
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Core Services & Scientific Trust Pillars */}
        <ServicesPillars />

        {/* 4. Interactive Recipe Evaluator & Screening Console */}
        <RecipeEvaluator
          initialRecipe={selectedCandidateRecipe}
          onInspectCandidate={handleSelectCandidate}
        />

        {/* 5. Top Recommended Candidates Showcase (Precomputed Consensus Explorer) */}
        <CandidatesTable onSelectCandidateForEvaluator={handleSelectCandidate} />

        {/* 6. The Pipeline & Methodology (Interactive Stepper) */}
        <MethodologyStepper />
      </main>

      {/* 7 & 9. Scientific Disclaimer, Citations, & Footer */}
      <Footer />

      {/* 8. Developer Model API Documentation Modal */}
      <ApiDocsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />

      {/* Standalone Single-File HTML Exporter Modal */}
      <SingleFileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
