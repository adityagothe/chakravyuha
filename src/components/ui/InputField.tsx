import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

export function InputField({ label, error, containerClassName, className, id, ...props }: InputFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      <label
        htmlFor={fieldId}
        className="font-label text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant"
      >
        {label}
        {props.required && <span className="text-secondary ml-1">*</span>}
      </label>
      <input
        id={fieldId}
        className={cn(
          'w-full bg-surface-container-low border rounded px-4 py-3.5',
          'font-body text-on-surface placeholder:text-on-surface-variant/40',
          'transition-all duration-200 outline-none',
          'focus:border-primary/60 focus:bg-surface-container focus:ring-1 focus:ring-primary/20',
          error
            ? 'border-error/60 bg-error/5'
            : 'border-outline-variant/20 hover:border-outline-variant/40',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="font-label text-xs text-error flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm" style={{ fontSize: '14px' }}>error</span>
          {error}
        </p>
      )}
    </div>
  );
}
