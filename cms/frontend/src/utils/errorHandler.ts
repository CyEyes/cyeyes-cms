import toast from 'react-hot-toast';

interface ValidationDetail {
  field: string;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
      details?: ValidationDetail[];
    };
  };
  message?: string;
}

/**
 * Handle API errors with detailed validation messages
 * @param error The error object from API call
 * @param defaultMessage Default error message if no specific error is found
 */
export function handleApiError(error: ApiError, defaultMessage: string = 'An error occurred'): void {
  // Handle validation errors with detailed field-level messages
  if (error.response?.data?.error === 'Validation failed' && error.response?.data?.details) {
    const details = error.response.data.details;
    const errorMessages = details
      .map((d) => `• ${d.field}: ${d.message}`)
      .join('\n');

    toast.error(
      `Validation Failed:\n${errorMessages}`,
      {
        duration: 6000,
        style: {
          whiteSpace: 'pre-line',
          maxWidth: '500px',
          textAlign: 'left',
        },
      }
    );
  } else {
    // Handle generic errors
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage;

    toast.error(errorMessage, {
      duration: 4000,
    });
  }
}

/**
 * Format validation errors for display
 * @param details Array of validation error details
 * @returns Formatted error message string
 */
export function formatValidationErrors(details: ValidationDetail[]): string {
  return details
    .map((d, index) => `${index + 1}. ${d.field}: ${d.message}`)
    .join('\n');
}
