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
      setErrorMsg('Please specify both email and password.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMsg('Please provide your name for account setup.');
      return;
    }

    const userName = isSignUp ? name : email.split('@')[0];
    onLoginSuccess(userName, email, plan);
  };

  const handleDemoEntry = () => {
    onLoginSuccess('David', 'david@studio.sharp.ai', 'pro');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-100 z-50">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto shadow-sm text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Sharp AI
            </h1>
            <p className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-wider">
              Content Studio
            </p>
          </div>
          
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Transform single ideas into blog articles, LinkedIn updates, newsletters, and social copy.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1">
              <label htmlFor="auth-name" className="text-[11px] font-semibold text-slate-300">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-[11px] font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="auth-password" className="text-[11px] font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                required
              />
            </div>
          </div>

          {isSignUp && (
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-semibold text-slate-300">Initial Plan</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPlan('free')}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    plan === 'free'
                      ? 'bg-slate-950 border-indigo-500 text-white'
                      : 'bg-slate-950/40 hover:bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block text-xs font-bold leading-none">Free Tier</span>
                  <span className="block text-[10px] text-slate-500 mt-1 font-mono">5k words/mo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlan('pro')}
                  className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                    plan === 'pro'
                      ? 'bg-indigo-600/15 border-indigo-500 text-indigo-300'
                      : 'bg-slate-950/40 hover:bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="block text-xs font-bold leading-none">Pro Tier</span>
                  <span className="block text-[10px] text-slate-500 mt-1 font-mono">Unmetered</span>
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="text-xs text-rose-400 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{isSignUp ? 'Create Studio Workspace' : 'Sign In to Studio'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div className="text-center space-y-3 pt-3 border-t border-slate-800 text-xs">
          <p className="text-slate-400 text-[11px]">
            {isSignUp ? 'Already have an account?' : 'Need a new studio workspace?'}
            {' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="font-semibold text-indigo-400 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          <button
            onClick={handleDemoEntry}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Enter Demo Studio Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
