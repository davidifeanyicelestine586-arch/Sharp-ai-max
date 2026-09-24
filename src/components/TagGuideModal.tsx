import React, { useState, useEffect } from 'react';
import { 
  X, 
  Tag, 
  SlidersHorizontal, 
  BookOpen
} from 'lucide-react';

interface TagGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagGuideModal({ isOpen, onClose }: TagGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Label Organization Guide",
      description: "Organize single-post drafts and 5-in-1 multi-channel stacks with structured pipeline tags.",
      icon: Tag,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Assigning tags helps you categorize drafts by phase, client, campaign quarter, or content pillar.
          </p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 justify-center">
            {['Draft', 'Final', 'Q1-Campaign', 'Product-Launch'].map(lbl => (
              <span key={lbl} className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 rounded-md">
                {lbl}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Tagging Workflows",
      description: "Assign labels prior to generation or inside the studio archive inspector.",
      icon: BookOpen,
      content: (
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-white block">1. Generation Stage</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Select or type a tag in the Single Writer or Content Stacker before saving to attach labels to the draft.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-white block">2. Archive Inspector</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Click any draft in the Studio Archive to add, delete, or modify tags directly in the inspector header.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Fast Filtering",
      description: "Filter drafts by tag or combine tag filters with full-text search.",
      icon: SlidersHorizontal,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            The Studio Archive automatically aggregates all unique tags into filter buttons. Selecting a tag displays only matching drafts.
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            Combine full-text queries with active tag chips to instantly locate drafts across blogs, LinkedIn posts, or newsletters.
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const currentStepData = steps[currentStep] ?? steps[0];
  if (!currentStepData) return null;
  const ActiveIcon = currentStepData.icon;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-guide-title"
    >
      <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ActiveIcon className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase text-indigo-400 tracking-wider block">
                Guide {currentStep + 1} of {steps.length}
              </span>
              <h2 id="tag-guide-title" className="text-sm font-bold text-white">
                {currentStepData.title}
              </h2>
            </div>
          </div>
          <button type="button" 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
            aria-label="Close guide"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentStepData.description}
          </p>
          <div className="pt-1">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <span 
                key={idx} 
                className={`h-1.5 rounded-sm transition-all duration-200 ${
                  currentStep === idx ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3 py-1.5 border border-slate-800 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Back
              </button>
            )}
            <button type="button"
              onClick={handleNext}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Got it' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
