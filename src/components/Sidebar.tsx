/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
  Moon
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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'write', label: 'AI Writer', icon: PenTool },
    { id: 'stacker', label: 'Content Stacker', icon: Layers, badge: '5-in-1' },
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
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white block leading-tight">
              Sharp AI
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-semibold uppercase tracking-wider block">
              Content Studio
            </span>
          </div>
        </div>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-indigo-600/15 text-white border border-indigo-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
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
        <button
          id="theme-toggler"
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
          title="Toggle UI appearance theme"
          aria-label="Toggle UI appearance theme"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="h-3.5 w-3.5 text-indigo-400" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
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

        {user.isLoggedIn && (
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
            <button 
              id="logout-button"
              onClick={onLogout}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-900"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden h-14 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-indigo-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">
            Sharp AI
          </span>
        </div>
        <button 
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 z-50 transform md:relative md:translate-x-0 transition-transform duration-200 md:h-screen shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavContent />
      </div>
    </>
  );
}
