import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './Button';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  kicker?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  kicker,
  description,
  icon,
  size = 'md',
  children,
  footer,
  ariaLabelledBy = 'modal-title',
  ariaDescribedBy,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in font-sans"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Window */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? ariaLabelledBy : undefined}
        aria-describedby={description ? ariaDescribedBy : undefined}
        className={`relative w-full ${sizeStyles[size]} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] z-10 transition-all`}
      >
        {/* Header */}
        {(title || kicker || icon) && (
          <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-start gap-3.5 pr-6">
              {icon && (
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                  {icon}
                </div>
              )}
              <div className="space-y-1">
                {kicker && (
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block">
                    {kicker}
                  </span>
                )}
                {title && (
                  <h2
                    id={ariaLabelledBy}
                    className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={ariaDescribedBy}
                    className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>

            <IconButton
              aria-label="Close dialog"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0 -mr-2 -mt-2"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-slate-700 dark:text-slate-200 text-xs sm:text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 rounded-b-2xl sm:rounded-b-3xl shrink-0 flex items-center justify-between gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
