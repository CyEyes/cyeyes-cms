/**
 * Validation Error Helper
 * Parses and formats validation errors from backend
 */

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ParsedValidationErrors {
  general?: string;
  fields: Record<string, string>;
}

/**
 * Parse validation errors from API response
 */
export function parseValidationErrors(error: any): ParsedValidationErrors {
  const result: ParsedValidationErrors = {
    fields: {},
  };

  // Check if error has validation errors array
  if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    const errors = error.response.data.errors;

    errors.forEach((err: any) => {
      const field = err.path?.[0] || 'unknown';
      const message = err.message || 'Invalid input';

      result.fields[field] = message;
    });

    // Set general message if provided
    if (error.response.data.message) {
      result.general = error.response.data.message;
    }
  } else if (error?.response?.data?.message) {
    // If no validation errors array, use general message
    result.general = error.response.data.message;
  } else if (error?.message) {
    // Fallback to error message
    result.general = error.message;
  } else {
    result.general = 'An error occurred';
  }

  return result;
}

/**
 * Get field error message
 */
export function getFieldError(
  fieldErrors: Record<string, string>,
  fieldName: string
): string | undefined {
  return fieldErrors[fieldName];
}

/**
 * Check if field has error
 */
export function hasFieldError(
  fieldErrors: Record<string, string>,
  fieldName: string
): boolean {
  return !!fieldErrors[fieldName];
}

/**
 * Get error count
 */
export function getErrorCount(fieldErrors: Record<string, string>): number {
  return Object.keys(fieldErrors).length;
}

/**
 * Clear field error
 */
export function clearFieldError(
  fieldErrors: Record<string, string>,
  fieldName: string
): Record<string, string> {
  const newErrors = { ...fieldErrors };
  delete newErrors[fieldName];
  return newErrors;
}
