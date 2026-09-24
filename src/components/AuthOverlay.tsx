import React, { useState } from 'react';
import { Sparkles, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthOverlayProps {
  onLoginSuccess: (name: string, email: string, tier: 'free' | 'pro') => void;
}

export default function AuthOverlay({ onLoginSuccess }: AuthOverlayProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please provide a name and email for this local workspace.');
      return;
    }

    onLoginSuccess(name.trim(), email.trim(), plan);
  };

  const handleDemoEntry = () => {
    onLoginSuccess('Demo User', 'demo@local.workspace', 'pro');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-100 z-50">
      <div className="w-full max-w-sm p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto shadow-sm text-white">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Sharp AI</h1>
            <p className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-wider">
              Content Studio
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Turn one idea into channel-ready content from a single workspace.
          </p>

          <p className="text-[10px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 leading-relaxed">
            Local prototype: this screen does not authenticate an account or store a password. Workspace data stays in this browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label htmlFor="auth-name" className="text-[11px] font-semibold text-slate-300">Workspace Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={event => setName(event.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="auth-email" className="text-[11px] font-semibold text-slate-300">Workspace Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder="jane@company.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <span className="text-[11px] font-semibold text-slate-300">Workspace Tier</span>
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
                <span className="block text-xs font-bold leading-none">Free Preview</span>
                <span className="block text-[10px] text-slate-500 mt-1 font-mono">100 local credits</span>
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
                <span className="block text-xs font-bold leading-none">Pro Preview</span>
                <span className="block text-[10px] text-slate-500 mt-1 font-mono">1,000 local credits</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div role="alert" className="text-xs text-rose-400 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold leading-none transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Open Local Workspace</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleDemoEntry}
            className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Enter Demo Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
