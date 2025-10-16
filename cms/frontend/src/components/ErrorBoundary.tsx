import { Component, ErrorInfo, ReactNode } from 'react';
import { debugLogger } from '@/utils/debug';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors
 * Provides detailed error information in development mode
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to debug system
    debugLogger.error('ErrorBoundary', 'React Error Caught', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // TODO: Send to error reporting service (Sentry, etc.)
      console.error('Production Error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <ErrorFallback error={this.state.error!} errorInfo={this.state.errorInfo!} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
  onReset: () => void;
}

function ErrorFallback({ error, errorInfo, onReset }: ErrorFallbackProps) {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
              <p className="text-red-100 text-sm mt-1">
                {isDev ? 'Check the details below' : 'We\'re working on fixing this issue'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Error Message:</label>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-mono text-sm">{error.message}</p>
            </div>
          </div>

          {/* Error Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Error Type:</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-gray-800 font-mono text-sm">{error.name}</p>
            </div>
          </div>

          {/* Development-only details */}
          {isDev && (
            <>
              {/* Stack Trace */}
              {error.stack && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Stack Trace:</label>
                  <div className="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto max-h-48 overflow-y-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{error.stack}</pre>
                  </div>
                </div>
              )}

              {/* Component Stack */}
              {errorInfo.componentStack && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Component Stack:</label>
                  <div className="bg-gray-900 text-blue-400 rounded-lg p-4 overflow-x-auto max-h-48 overflow-y-auto">
                    <pre className="text-xs font-mono whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                  </div>
                </div>
              )}

              {/* Debug Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Debug Tips:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Check the browser console for more details</li>
                  <li>Use <code className="bg-blue-100 px-1 rounded">window.__CYEYES_DEBUG__.dumpState()</code> to see debug info</li>
                  <li>Check recent API calls in Network tab</li>
                  <li>Look for null/undefined values in props</li>
                </ul>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onReset}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all"
            >
              Go Home
            </button>
          </div>

          {/* Debug Console Tip */}
          {isDev && (
            <div className="text-center text-xs text-gray-500 pt-2">
              Error logged to debug console. Open DevTools to see more details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
