import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PenTool, 
  Layers, 
  BookOpen, 
  History, 
  User, 
  Sparkles, 
  Menu, 
  X,
  CreditCard,
  Sun,
  Moon,
  LogIn,
  Compass
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, theme, onToggleTheme }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close drawer on Escape key press for keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const menuItems = [
    { id: 'overview', label: 'SaaS Showcase', icon: Compass },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stacker', label: 'Content Stacker', icon: Layers, badge: '5-in-1' },
    { id: 'write', label: 'AI Writer', icon: PenTool },
    { id: 'prompts', label: 'Prompt Library', icon: BookOpen },
    { id: 'history', label: 'Studio Archive', icon: History },
    { id: 'profile', label: 'Account & Quota', icon: User },
  ];

  const remainingCredits = Math.max(0, user.creditsTotal - user.creditsUsed);
  const creditPercentage = Math.min(100, Math.round((user.creditsUsed / user.creditsTotal) * 100));

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveTab('overview');
            setIsOpen(false);
          }}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          title="Switch to SaaS Landing Showcase"
        >
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-500 transition-colors shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight group-hover:text-indigo-200 transition-colors">
              Sharp AI Max
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-wider block">
              Multi-Channel Content Studio
            </span>
          </div>
        </button>
        {isOpen && (
          <button type="button" 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items with Semantic ARIA and 44px min-height */}
      <nav aria-label="Main Navigation" className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button type="button"
              id={`nav-item-${item.id}`}
              key={item.id}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600/15 text-white border border-indigo-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggler */}
      <div className="px-3 py-3 border-t border-slate-800 shrink-0">
        <button type="button"
          id="theme-toggler"
          onClick={onToggleTheme}
          className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
          title="Toggle UI appearance theme"
          aria-label="Toggle UI appearance theme"
        >
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-indigo-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
            <span>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
            {theme.toUpperCase()}
          </span>
        </button>
      </div>

      {/* Quota & User Profile */}
      <div className="p-3 border-t border-slate-800 space-y-3 shrink-0">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Monthly Usage</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
              user.tier === 'pro' 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                : 'bg-slate-800 text-slate-400'
            }`}>
              {user.tier}
            </span>
          </div>
          
          <div className="flex items-baseline justify-between text-xs font-mono">
            <span className="text-sm font-bold text-white tabular-nums">
              {remainingCredits}
            </span>
            <span className="text-slate-400 text-[11px] tabular-nums">
              / {user.creditsTotal} credits
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-md h-1.5 overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-sm transition-all duration-300 ${
                creditPercentage > 85 
                  ? 'bg-rose-500' 
                  : creditPercentage > 60 
                  ? 'bg-amber-500' 
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.max(4, 100 - creditPercentage)}%` }}
            />
          </div>
        </div>

        {user.isLoggedIn ? (
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="min-w-0 flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono uppercase shrink-0">
                {user.name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button type="button" 
              id="logout-button"
              onClick={onLogout}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-900"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button type="button"
            onClick={() => {
              setActiveTab('profile');
              setIsOpen(false);
            }}
            className="w-full min-h-[42px] py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In to Workspace</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sticky Header Bar with Top-Right Utilities */}
      <header className="md:hidden h-16 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-white sticky top-0 z-40 select-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-500 transition-colors shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              Sharp AI Max
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-wider block">
              Multi-Channel Studio
            </span>
          </div>
        </button>

        {/* Top-Right Utilities: Theme switcher and mobile menu */}
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={onToggleTheme}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border border-slate-800"
            aria-label="Toggle visual theme"
            title="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-indigo-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          <button type="button" 
            id="mobile-menu-toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-drawer"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        id="mobile-navigation-drawer"
        role="dialog"
        aria-label="Navigation Menu"
        aria-modal={isOpen ? 'true' : undefined}
        className={`fixed inset-y-0 left-0 w-64 z-50 transform md:relative md:translate-x-0 transition-transform duration-200 md:h-screen shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </div>
    </>
  );
}
