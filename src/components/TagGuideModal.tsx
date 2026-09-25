import React, { useState } from 'react';
import { Tag, SlidersHorizontal, BookOpen } from 'lucide-react';
import { Modal, Button, Badge } from './ui';

interface TagGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TagGuideModal({ isOpen, onClose }: TagGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Label Organization Guide",
      description: "Organize single-post drafts and 5-in-1 multi-channel stacks with structured pipeline tags.",
      icon: <Tag className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Assigning tags helps you categorize drafts by phase, client, campaign quarter, or content pillar.
          </p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 justify-center">
            {['Draft', 'Final', 'Q1-Campaign', 'Product-Launch'].map(lbl => (
              <Badge key={lbl} variant="primary" size="sm">
                {lbl}
              </Badge>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Tagging Workflows",
      description: "Assign labels prior to generation or inside the studio archive inspector.",
      icon: <BookOpen className="h-4 w-4" />,
      content: (
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">1. Generation Stage</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Select or type a tag in the Single Writer or Content Stacker before saving to attach labels to the draft.
            </p>
          </div>
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-900 dark:text-white block">2. Archive Inspector</span>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Click any draft in the Studio Archive to add, delete, or modify tags directly in the inspector header.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Fast Filtering",
      description: "Filter drafts by tag or combine tag filters with full-text search.",
      icon: <SlidersHorizontal className="h-4 w-4" />,
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The Studio Archive automatically aggregates all unique tags into filter buttons. Selecting a tag displays only matching drafts.
          </p>
          <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      kicker={`Guide ${currentStep + 1} of ${steps.length}`}
      title={currentStepData.title}
      icon={currentStepData.icon}
      ariaLabelledBy="tag-guide-title"
      footer={
        <>
          <div className="flex gap-1.5 items-center">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-sm transition-all duration-200 ${
                  currentStep === idx ? 'w-4 bg-indigo-500' : 'w-1.5 bg-slate-300 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Back
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Got it' : 'Next'}
            </Button>
          </div>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentStepData.description}
        </p>
        <div className="pt-1">{currentStepData.content}</div>
      </div>
    </Modal>
  );
}
