import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export interface FormFieldProps {
  id?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  rightNote?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const FormField = ({
  id,
  label,
  description,
  error,
  required,
  optional,
  rightNote,
  className = '',
  children,
}: FormFieldProps) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || rightNote) && (
        <div className="flex items-center justify-between gap-2 text-xs">
          {label && (
            <label
              htmlFor={id}
              className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <span>{label}</span>
              {required && <span className="text-rose-500 font-bold" aria-hidden="true">*</span>}
              {optional && (
                <span className="text-[11px] font-normal text-slate-400">
                  (optional)
                </span>
              )}
            </label>
          )}
          {rightNote && (
            <span className="text-slate-400 text-[11px] font-mono shrink-0">
              {rightNote}
            </span>
          )}
        </div>
      )}

      {children}

      {description && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}

      {error && (
        <div role="alert" className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, leftIcon, rightIcon, className = '', disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full h-10 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-800 focus:border-indigo-500'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 flex items-center shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = '', disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border p-3.5 text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-800 focus:border-indigo-500'
        } ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error = false, className = '', disabled, children, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full h-10 appearance-none bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-xl border pl-3.5 pr-10 text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-800 focus:border-indigo-500'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400 flex items-center">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Toggle = ({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}: ToggleProps) => {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      {(label || description) && (
        <div className="space-y-0.5">
          {label && (
            <label
              htmlFor={id}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-indigo-600' : 'bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
