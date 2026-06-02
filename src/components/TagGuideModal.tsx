/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  SlidersHorizontal, 
  Sparkles, 
  Bookmark, 
  HelpCircle,
  FolderIcon,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface TagGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagGuideModal({ isOpen, onClose }: TagGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Label Organization",
      description: "Managing multi-channel content is easier than ever. You can now tag and bucket your drafts to build consistent, structured campaign pipelines.",
      icon: Tag,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Whether you are crafting high-converting social campaigns on the Single Writer or repurposing major ideas using Content Stacker, labeling keeps everything clean.
          </p>
          <div className="flex flex-wrap gap-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-900 justify-center">
            {['Draft', 'Final', 'Q1-Campaign'].map(lbl => (
              <span key={lbl} className="px-2 py-1 text-[10px] font-extrabold font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded shadow-sm">
                {lbl}
              </span>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "How to Assign Labels",
      description: "Tag drafts at creation before saving, or manage labels inside your historic archive.",
      icon: BookOpen,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      content: (
        <div className="text-slate-300 text-xs space-y-2.5">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
            <span className="block font-bold text-slate-200">1. Pre-Generation Stage</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Type a custom label or choose a preset in the editor toolbar. When you press **Save Draft**, those tags instantly sync to that campaign record.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5">
            <span className="block font-bold text-slate-200">2. Real-Time Inspector Edits</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Within your archive workspace, click **+ Custom Label** or pick pre-sets inside the selected draft window to assign and untag labels in one-click.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Search & Filter Like a Pro",
      description: "Isolate campaigns instantly by selecting active project labels inside your studio archive directory.",
      icon: SlidersHorizontal,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Your studio sidebar automatically indexes all active tags used in your history. Switch from viewing all drafts to displaying specific promotional campaign tags instantly.
          </p>
          <div className="p-3.5 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[11px] text-indigo-300 flex gap-2.5 items-start">
            <span className="text-sm">💡</span>
            <p className="leading-relaxed font-medium">
              Combine core keyword queries (e.g. search box) on top of active tag filters to surgically retrieve specific cross-channel copy in seconds.
            </p>
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

  const ActiveIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[99999] animate-fade-in font-sans">
      <div className="w-full max-w-lg p-7 rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl relative space-y-6 flex flex-col justify-between">
        {/* Header Close button */}
        <div className="flex items-center justify-between border-b border-slate-805/40 pb-4">
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-lg border ${steps[currentStep].color}`}>
              <ActiveIcon className="h-4.5 w-4.5 shrink-0" />
            </span>
            <div>
              <span className="block text-[9px] font-extrabold uppercase text-indigo-400 tracking-wider font-mono">Onboarding Wizard Step {currentStep + 1} of {steps.length}</span>
              <h2 className="text-sm font-bold text-slate-200 mt-0.5">{steps[currentStep].title}</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-550 hover:text-slate-350 hover:bg-slate-850 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4 shrink-0" />
          </button>
        </div>

        {/* Informative message */}
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-slate-350 leading-relaxed font-medium">
            {steps[currentStep].description}
          </p>
          
          <div className="pt-2">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Step Indicator and footer triggers */}
        <div className="pt-5 border-t border-slate-855/40 flex items-center justify-between bg-slate-900">
          <div className="flex gap-1.5 select-none">
            {steps.map((_, idx) => (
              <span 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === idx ? 'w-5 bg-indigo-500' : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold rounded-xl cursor-pointer shadow-md shadow-indigo-600/10 flex items-center gap-1.5 transition-all"
            >
              <span>{currentStep === steps.length - 1 ? "Got It, Let's Write!" : "Next Chapter"}</span>
              {currentStep < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
