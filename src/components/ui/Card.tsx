import React from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardVariant = 'default' | 'subtle' | 'outline' | 'interactive';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  isHoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs dark:shadow-none',
  subtle: 'bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80',
  outline: 'bg-transparent border border-slate-200 dark:border-slate-800',
  interactive: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer',
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', isHoverable = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-2xl text-slate-900 dark:text-slate-100 transition-colors ${
          isHoverable ? variantStyles.interactive : variantStyles[variant]
        } ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardHeader = ({ bordered = false, className = '', children, ...props }: CardHeaderProps) => (
  <div
    className={`space-y-1.5 ${bordered ? 'border-b border-slate-200 dark:border-slate-800 pb-4 mb-4' : 'mb-4'} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`space-y-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  bordered = false,
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean }) => (
  <div
    className={`flex items-center justify-between gap-3 pt-4 ${
      bordered ? 'border-t border-slate-200 dark:border-slate-800 mt-4' : 'mt-4'
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);
