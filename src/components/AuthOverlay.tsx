/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface AuthOverlayProps {
  onLoginSuccess: (name: string, email: string, tier: 'free' | 'pro') => void;
}

export default function AuthOverlay({ onLoginSuccess }: AuthOverlayProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please specify all email and password parameters.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg('Please specify your name for account set up.');
      return;
    }

    // Capture or register initial users
    const userName = isSignUp ? name : email.split('@')[0];
    onLoginSuccess(userName, email, plan);
  };

  const handlePlaygroundEntry = () => {
    // Quick guest profile login
    onLoginSuccess('David', 'david@editor.sharp.ai', 'pro');
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 overflow-y-auto font-sans text-slate-100 z-[9999]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04),transparent)] pointer-events-none" />
      
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-900 shadow-2xl relative space-y-8 backdrop-blur-md">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mx-auto select-none">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              Sharp AI
            </h1>
            <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest leading-none">
              Content Studio SaaS
            </p>
          </div>
          
          <p className="text-xs text-slate-450 leading-relaxed max-w-xs mx-auto">
            Transform a single idea into blog posts, LinkedIn articles, newsletters, and visual copy instantly.
          </p>
        </div>

        {/* Action Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Your Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650 shrink-0 pointer-events-none select-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500/50 placeholder-slate-800 transition-colors"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650 shrink-0 pointer-events-none select-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500/50 placeholder-slate-800 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-650 shrink-0 pointer-events-none select-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 text-slate-200 border border-slate-900 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500/50 placeholder-slate-850 transition-colors"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1.5 pt-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Select Signup Plan</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPlan('free')}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    plan === 'free'
                      ? 'bg-slate-950 border-slate-700 text-slate-100 shadow-sm'
                      : 'bg-slate-950/20 hover:bg-slate-950 border-slate-950 text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <span className="block text-xs font-bold leading-none">Free Plan</span>
                  <span className="block text-[9px] text-slate-500 mt-1">5,000 words allowance</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan('pro')}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer relative overflow-hidden ${
                    plan === 'pro'
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 shadow-sm'
                      : 'bg-slate-950/20 hover:bg-slate-950 border-slate-950 text-slate-500 hover:text-slate-350'
                  }`}
                >
                  <span className="block text-xs font-bold leading-none flex items-center justify-center gap-1">
                    <Zap className="h-3 w-3 text-indigo-400 fill-indigo-400/10 shrink-0" />
                    <span>Pro Plan</span>
                  </span>
                  <span className="block text-[9px] text-slate-500 mt-1">Unlimited outputs</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs text-rose-400 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-xl text-center leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Core Entry Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-500 text-slate-100 text-xs font-bold leading-none shadow-md shadow-indigo-600/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSignUp ? 'Create Workspace' : 'Sign In to Workspace'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Form type link */}
        <div className="text-center space-y-4 pt-1 border-t border-slate-950/60 shrink-0 select-none">
          <p className="text-[11px] text-slate-500">
            {isSignUp ? 'Already own a studio workspace?' : 'Want to register a personal space?'}
            {' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="font-bold text-indigo-400 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Create Account'}
            </button>
          </p>

          <div className="flex items-center gap-2 text-[10px] text-slate-650 justify-center">
            <span className="h-px w-5 bg-slate-900/60" />
            <span>OR</span>
            <span className="h-px w-5 bg-slate-900/60" />
          </div>

          <button
            onClick={handlePlaygroundEntry}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-slate-400 hover:text-indigo-400 text-xs font-bold leading-none cursor-pointer flex items-center justify-center gap-2 transition-all shadow-inner"
          >
            <ShieldCheck className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>Launch Instant Developer Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
