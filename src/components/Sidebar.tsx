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
  Zap,
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
    { id: 'stacker', label: 'Content Stacker', icon: Layers, highlight: true },
    { id: 'prompts', label: 'Prompt Library', icon: BookOpen },
    { id: 'history', label: 'Content Studio', icon: History },
    { id: 'profile', label: 'Billing & Account', icon: User },
  ];

  const creditPercentage = Math.min(100, Math.round((user.creditsUsed / user.creditsTotal) * 100));
  const remainingCredits = user.creditsTotal - user.creditsUsed;

  const NavContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-900">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-white dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-indigo-200 dark:bg-clip-text dark:text-transparent">
              Sharp AI
            </span>
            <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase">
              Content Studio
            </span>
          </div>
        </div>
        {isOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer ${
                isActive
                  ? 'bg-indigo-50/70 text-indigo-600 border-l-2 border-indigo-600 dark:bg-gradient-to-r dark:from-indigo-950/80 dark:to-indigo-900/40 dark:text-indigo-200 dark:border-indigo-500 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-900/60'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                isActive ? 'text-indigo-600 dark:text-indigo-400 scale-110' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200'
              }`} />
              
              <span className="flex-1 text-left">{item.label}</span>
              
              {item.highlight && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-550 dark:bg-indigo-500 text-white rounded-full flex items-center gap-0.5 shadow-sm shadow-indigo-500/10 animate-pulse">
                  <Zap className="h-2.5 w-2.5 fill-current" /> STACK
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Interactive Theme Toggling Controller */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-900 bg-slate-50/30 dark:bg-transparent">
        <button
          id="theme-toggler"
          onClick={onToggleTheme}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/70 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 transition-all active:scale-[0.98] cursor-pointer"
          title="Toggle workspace layout color themes"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-indigo-400 animate-pulse" />
            ) : (
              <Sun className="h-4 w-4 text-amber-550" />
            )}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
            {theme === 'dark' ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* Credit / Subscription Card */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-900 bg-slate-55/10 dark:bg-transparent">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Workspace Usage</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
              user.tier === 'pro' 
                ? 'bg-indigo-50/60 text-indigo-600 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20' 
                : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {user.tier} Plan
            </span>
          </div>
          
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
              {remainingCredits}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              / {user.creditsTotal} credits left
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                creditPercentage > 85 
                  ? 'bg-rose-500' 
                  : creditPercentage > 60 
                  ? 'bg-amber-500' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{ width: `${100 - creditPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Monthly allowance resets soon
          </p>
        </div>

        {/* User Card */}
        {user.isLoggedIn && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-900 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
            <button 
              id="logout-button"
              onClick={onLogout}
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-900/60 rounded"
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
      {/* Mobile Top Bar */}
      <div className="md:hidden h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 px-6 flex items-center justify-between text-slate-900 dark:text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white dark:bg-gradient-to-r dark:from-white dark:to-slate-200 dark:bg-clip-text dark:text-transparent">
            Sharp AI
          </span>
        </div>
        <button 
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(true)}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div className={`fixed inset-y-0 left-0 w-64 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 md:h-screen shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavContent />
      </div>
    </>
  );
}
