import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  ArrowRight,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Button, IconButton } from './Button';

export interface AppHeaderProps {
  variant: 'landing' | 'workspace';
  user?: UserProfile;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onEnterStudio?: (tier?: 'free' | 'pro') => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  activeTabTitle?: string;
}

export const AppHeader = ({
  variant,
  user,
  theme,
  onToggleTheme,
  onEnterStudio,
  onOpenAuthModal,
  onLogout,
  onToggleMobileMenu,
  isMobileMenuOpen = false,
  activeTabTitle,
}: AppHeaderProps) => {
  const remainingCredits = user ? Math.max(0, user.creditsTotal - user.creditsUsed) : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Unified Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          {variant === 'workspace' && onToggleMobileMenu && (
            <IconButton
              aria-label="Toggle navigation drawer"
              aria-expanded={isMobileMenuOpen}
              variant="outline"
              size="sm"
              onClick={onToggleMobileMenu}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </IconButton>
          )}

          <div
            role="banner"
            onClick={() => onEnterStudio && onEnterStudio()}
            className={`flex items-center gap-3 ${onEnterStudio ? 'cursor-pointer group' : ''}`}
            title="Sharp AI Max Studio"
          >
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs group-hover:bg-indigo-500 transition-colors shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                Sharp AI Max
              </span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-mono font-semibold uppercase tracking-wider block">
                Multi-Channel Content Studio
              </span>
            </div>
          </div>

          {variant === 'workspace' && activeTabTitle && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200">{activeTabTitle}</span>
            </div>
          )}
        </div>

        {/* Landing Center Navigation Anchors */}
        {variant === 'landing' && (
          <nav
            aria-label="Landing Page Navigation"
            className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300"
          >
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
          </nav>
        )}

        {/* Header Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Theme Toggler */}
          <IconButton
            aria-label="Toggle color theme"
            variant="outline"
            size="sm"
            onClick={onToggleTheme}
            className="text-slate-600 dark:text-slate-300"
          >
            {theme === 'dark' ? (
              <Moon className="h-4 w-4 text-indigo-400" />
            ) : (
              <Sun className="h-4 w-4 text-amber-500" />
            )}
          </IconButton>

          {/* Contextual actions */}
          {variant === 'landing' ? (
            user?.isLoggedIn ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEnterStudio && onEnterStudio()}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Open Studio
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {onOpenAuthModal && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenAuthModal}
                    className="hidden sm:inline-flex"
                  >
                    Sign In
                  </Button>
                )}
                {onEnterStudio && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onEnterStudio('free')}
                    rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                  >
                    <span className="hidden sm:inline">Launch Free Workspace</span>
                    <span className="sm:hidden">Launch</span>
                  </Button>
                )}
              </div>
            )
          ) : (
            // Workspace variant
            <div className="flex items-center gap-2.5">
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
                    Quota:
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {remainingCredits}
                  </span>
                  <span className="text-slate-400 text-[11px]">/ {user.creditsTotal}</span>
                </div>
              )}

              {user?.isLoggedIn && onLogout && (
                <IconButton
                  aria-label="Sign out of workspace"
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="text-slate-400 hover:text-rose-500 hover:border-rose-500/30"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </IconButton>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
