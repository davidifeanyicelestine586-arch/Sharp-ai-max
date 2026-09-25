import React from 'react';

export interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; onClick?: () => void }>;
  className?: string;
}

export const PageHeader = ({
  kicker,
  title,
  description,
  actions,
  breadcrumbs,
  className = '',
}: PageHeaderProps) => {
  return (
    <div className={`space-y-4 mb-6 sm:mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span aria-hidden="true" className="text-slate-600">/</span>}
              {crumb.onClick ? (
                <button
                  type="button"
                  onClick={crumb.onClick}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {crumb.label}
                </button>
              ) : (
                <span className="text-slate-200 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          {kicker && (
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              <span>{kicker}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          {description && (
            <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {description}
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
