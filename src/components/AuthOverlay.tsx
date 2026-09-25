import React, { useState } from 'react';
import { Sparkles, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Modal, FormField, Input, Button } from './ui';

interface AuthOverlayProps {
  onLoginSuccess: (name: string, email: string, tier: 'free' | 'pro') => void;
  onClose?: () => void;
}

export default function AuthOverlay({ onLoginSuccess, onClose }: AuthOverlayProps) {
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
    <Modal
      isOpen={true}
      onClose={onClose || (() => {})}
      size="sm"
      kicker="Content Studio"
      title="Sharp AI Max"
      icon={<Sparkles className="h-5 w-5" />}
      description="Turn one idea into channel-ready content from a single workspace."
      ariaLabelledBy="auth-title"
    >
      <div className="space-y-4">
        <div className="text-[11px] text-amber-600 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-3 py-2 leading-relaxed">
          Local prototype: this screen does not authenticate an account or store a password. Workspace data stays in this browser.
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <FormField id="auth-name" label="Workspace Name" required>
            <Input
              id="auth-name"
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              leftIcon={<User className="h-4 w-4" />}
              required
            />
          </FormField>

          <FormField id="auth-email" label="Workspace Email" required>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              placeholder="jane@company.com"
              autoComplete="email"
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />
          </FormField>

          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Workspace Tier
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlan('free')}
                className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                  plan === 'free'
                    ? 'bg-slate-100 dark:bg-slate-950 border-indigo-500 text-slate-900 dark:text-white ring-1 ring-indigo-500'
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="block text-xs font-bold leading-none">Free Preview</span>
                <span className="block text-[10px] text-slate-500 mt-1 font-mono">100 credits</span>
              </button>
              <button
                type="button"
                onClick={() => setPlan('pro')}
                className={`p-2.5 rounded-xl border text-center transition-colors cursor-pointer ${
                  plan === 'pro'
                    ? 'bg-indigo-50 dark:bg-indigo-600/15 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                    : 'bg-white dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="block text-xs font-bold leading-none">Pro Preview</span>
                <span className="block text-[10px] text-slate-500 mt-1 font-mono">1,000 credits</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div role="alert" className="text-xs text-rose-500 p-2.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
          >
            Open Local Workspace
          </Button>
        </form>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleDemoEntry}
            leftIcon={<ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
          >
            Enter Demo Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
}
