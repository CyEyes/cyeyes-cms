/**
 * ValidationError Component
 * Displays validation error messages for form fields
 */

import { AlertCircle } from 'lucide-react';

interface ValidationErrorProps {
  error?: string;
  className?: string;
}

export default function ValidationError({ error, className = '' }: ValidationErrorProps) {
  if (!error) return null;

  return (
    <div className={`flex items-start gap-2 mt-1 text-sm text-red-600 ${className}`}>
      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
}

/**
 * Field wrapper with validation error
 */
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <ValidationError error={error} />
    </div>
  );
}
