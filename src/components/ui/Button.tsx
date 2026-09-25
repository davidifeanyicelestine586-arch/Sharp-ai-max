import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive' 
  | 'destructive-outline';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs border border-indigo-500/30 active:scale-[0.98]',
  secondary: 'bg-slate-800 hover:bg-slate-750 text-slate-100 font-semibold border border-slate-700/80 active:scale-[0.98]',
  outline: 'bg-transparent hover:bg-slate-800/60 text-slate-200 font-medium border border-slate-700 active:scale-[0.98]',
  ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white font-medium border border-transparent active:scale-[0.98]',
  destructive: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-xs border border-rose-500/30 active:scale-[0.98]',
  'destructive-outline': 'bg-transparent hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 font-medium border border-rose-500/30 active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs min-h-[32px] rounded-lg gap-1.5',
  sm: 'px-3 py-1.5 text-xs min-h-[36px] rounded-xl gap-2 font-medium',
  md: 'px-4 py-2 text-xs sm:text-sm min-h-[40px] rounded-xl gap-2 font-semibold',
  lg: 'px-5 py-2.5 text-sm sm:text-base min-h-[44px] rounded-xl gap-2.5 font-bold',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>}
            {children && <span>{children}</span>}
            {rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const iconSizeStyles: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg',
  md: 'h-10 w-10 min-h-[40px] min-w-[40px] rounded-xl',
  lg: 'h-11 w-11 min-h-[44px] min-w-[44px] rounded-xl',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      className = '',
      disabled,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${
          variantStyles[variant]
        } ${iconSizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : (
          children
        )}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
