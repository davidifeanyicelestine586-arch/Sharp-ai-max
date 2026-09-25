import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export interface AppFooterProps {
  variant?: 'landing' | 'workspace' | 'compact';
  onNavigateTab?: (tab: string) => void;
}

export const AppFooter = ({ variant = 'landing', onNavigateTab }: AppFooterProps) => {
  if (variant === 'compact') {
    return (
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-4 text-xs text-slate-500 bg-white/50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Sharp AI Max</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-400">Multi-Channel Content Studio</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-500">
            <Shield className="h-3 w-3 text-emerald-500" />
            <span>Local Storage Workspace</span>
            <span aria-hidden="true">·</span>
            <Cpu className="h-3 w-3 text-indigo-400" />
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 py-12 text-xs text-slate-500 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                Sharp AI Max
              </span>
              <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono font-semibold uppercase tracking-wider">
                Multi-Channel Content Studio
              </p>
            </div>
          </div>

          {/* Links Hierarchy */}
          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 font-medium">
            <a href="#sandbox" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#pillars" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Core Pillars
            </a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              FAQ
            </a>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Launch Workspace &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Legal, Privacy & Engine note */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Sharp AI Max. Engineered for creators, founders, and engineering teams.</p>
          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3 w-3 text-emerald-500" />
              <span>Zero cloud data tracking</span>
            </span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-indigo-400" />
              <span>Gemini 3.8 Flash model</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
