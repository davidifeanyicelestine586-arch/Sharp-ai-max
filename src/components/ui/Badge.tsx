import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'mono';
export type BadgeSize = 'xs' | 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30',
  success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
  neutral: 'bg-slate-800 text-slate-300 border border-slate-700/60',
  mono: 'font-mono text-[10px] uppercase tracking-wider bg-slate-900 text-slate-300 border border-slate-800',
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5 text-[9px] gap-1 rounded',
  sm: 'px-2 py-0.5 text-[10px] gap-1.5 rounded-md font-medium',
  md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-semibold',
};

export const Badge = ({
  variant = 'neutral',
  size = 'sm',
  icon,
  className = '',
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center leading-none select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
