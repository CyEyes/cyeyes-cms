/**
 * CyEyes CMS - Advanced Debug Utility
 * Comprehensive debugging system for frontend development
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: any;
}

class DebugLogger {
  private logHistory: LogEntry[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private maxHistorySize = 1000;
  private currentLogLevel: LogLevel = LogLevel.INFO;
  private enabled: boolean = false;
  private categories: Set<string> = new Set();

  constructor() {
    // Enable debug mode in development or when ?debug=true
    const isDev = import.meta.env.DEV;
    const hasDebugParam = new URLSearchParams(window.location.search).has('debug');
    this.enabled = isDev || hasDebugParam;

    if (this.enabled) {
      this.currentLogLevel = LogLevel.DEBUG;
      console.log(
        '%c🔧 CyEyes Debug Mode Enabled',
        'background: #17a2b8; color: white; padding: 4px 8px; border-radius: 3px; font-weight: bold;'
      );
      this.attachToWindow();
    }
  }

  /**
   * Attach debug utilities to window object for console access
   */
  private attachToWindow(): void {
    (window as any).__CYEYES_DEBUG__ = {
      logger: this,
      getHistory: () => this.logHistory,
      getMetrics: () => this.performanceMetrics,
      clearHistory: () => this.clearHistory(),
      setLevel: (level: LogLevel) => this.setLogLevel(level),
      enableCategory: (cat: string) => this.categories.add(cat),
      disableCategory: (cat: string) => this.categories.delete(cat),
      getCategories: () => Array.from(this.categories),
      dumpState: () => this.dumpState(),
    };

    console.log(
      '%cDebug utilities available at: window.__CYEYES_DEBUG__',
      'color: #17a2b8; font-style: italic;'
    );
  }

  /**
   * Set log level threshold
   */
  setLogLevel(level: LogLevel): void {
    this.currentLogLevel = level;
    this.info('Debug', `Log level set to: ${LogLevel[level]}`);
  }

  /**
   * Check if should log based on level and category
   */
  private shouldLog(level: LogLevel, category: string): boolean {
    if (!this.enabled) return false;
    if (level > this.currentLogLevel) return false;
    if (this.categories.size > 0 && !this.categories.has(category)) return false;
    return true;
  }

  /**
   * Create log entry
   */
  private log(level: LogLevel, category: string, message: string, data?: any): void {
    if (!this.shouldLog(level, category)) return;

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      stack: level === LogLevel.ERROR ? new Error().stack : undefined,
    };

    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    this.printToConsole(entry);
  }

  /**
   * Print formatted log to console
   */
  private printToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString().split('T')[1].split('.')[0];
    const levelStr = LogLevel[entry.level].padEnd(5);

    const styles: Record<LogLevel, string> = {
      [LogLevel.ERROR]: 'color: #f44336; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ff9800; font-weight: bold;',
      [LogLevel.INFO]: 'color: #2196F3;',
      [LogLevel.DEBUG]: 'color: #4CAF50;',
      [LogLevel.TRACE]: 'color: #9E9E9E;',
    };

    const categoryStyle = 'color: #17a2b8; font-weight: bold;';

    console.log(
      `%c[${timestamp}] %c[${levelStr}] %c[${entry.category}]%c ${entry.message}`,
      'color: #666;',
      styles[entry.level],
      categoryStyle,
      'color: inherit;',
      entry.data !== undefined ? entry.data : ''
    );

    if (entry.stack && entry.level === LogLevel.ERROR) {
      console.groupCollapsed('Stack Trace');
      console.log(entry.stack);
      console.groupEnd();
    }
  }

  /**
   * Error logging
   */
  error(category: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, category, message, data);
  }

  /**
   * Warning logging
   */
  warn(category: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  /**
   * Info logging
   */
  info(category: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  /**
   * Debug logging
   */
  debug(category: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  /**
   * Trace logging
   */
  trace(category: string, message: string, data?: any): void {
    this.log(LogLevel.TRACE, category, message, data);
  }

  /**
   * Group logging
   */
  group(category: string, title: string): void {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      console.group(`%c${category}: ${title}`, 'color: #17a2b8; font-weight: bold;');
    }
  }

  groupEnd(): void {
    if (this.enabled) {
      console.groupEnd();
    }
  }

  /**
   * Table logging for structured data
   */
  table(category: string, data: any): void {
    if (this.shouldLog(LogLevel.DEBUG, category)) {
      console.log(`%c[${category}]`, 'color: #17a2b8; font-weight: bold;');
      console.table(data);
    }
  }

  /**
   * Performance monitoring
   */
  startTimer(name: string): () => void {
    const startTime = performance.now();

    return (metadata?: any) => {
      const duration = performance.now() - startTime;
      const metric: PerformanceMetric = {
        name,
        duration,
        timestamp: new Date(),
        metadata,
      };

      this.performanceMetrics.push(metric);

      const color = duration > 1000 ? '#f44336' : duration > 500 ? '#ff9800' : '#4CAF50';
      console.log(
        `%c⏱️ ${name}: ${duration.toFixed(2)}ms`,
        `color: ${color}; font-weight: bold;`,
        metadata || ''
      );
    };
  }

  /**
   * Component lifecycle logging
   */
  componentMount(componentName: string, props?: any): void {
    this.debug('Component', `🎨 ${componentName} mounted`, props);
  }

  componentUnmount(componentName: string): void {
    this.debug('Component', `🗑️ ${componentName} unmounted`);
  }

  componentUpdate(componentName: string, prevProps?: any, newProps?: any): void {
    this.trace('Component', `🔄 ${componentName} updated`, { prevProps, newProps });
  }

  /**
   * State change logging
   */
  stateChange(location: string, prevState: any, newState: any): void {
    this.debug('State', `📦 State changed in ${location}`, { prevState, newState });
  }

  /**
   * API call logging
   */
  apiRequest(method: string, url: string, data?: any): void {
    this.info('API', `🚀 ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any, duration?: number): void {
    const emoji = status >= 200 && status < 300 ? '✅' : '❌';
    const message = `${emoji} ${method} ${url} (${status})${duration ? ` - ${duration.toFixed(0)}ms` : ''}`;

    if (status >= 400) {
      this.error('API', message, data);
    } else {
      this.info('API', message, data);
    }
  }

  /**
   * Router logging
   */
  routeChange(from: string, to: string): void {
    this.info('Router', `🧭 Navigation: ${from} → ${to}`);
  }

  /**
   * Form validation logging
   */
  formValidation(formName: string, errors: any): void {
    if (Object.keys(errors).length > 0) {
      this.warn('Form', `⚠️ Validation errors in ${formName}`, errors);
    } else {
      this.debug('Form', `✅ ${formName} validation passed`);
    }
  }

  /**
   * User action logging
   */
  userAction(action: string, details?: any): void {
    this.info('User', `👤 ${action}`, details);
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.logHistory = [];
    this.performanceMetrics = [];
    console.clear();
    this.info('Debug', 'History cleared');
  }

  /**
   * Dump current state for debugging
   */
  dumpState(): void {
    console.group('%c📊 CyEyes Debug State Dump', 'font-size: 14px; font-weight: bold; color: #17a2b8;');

    console.log('%cLog History:', 'font-weight: bold;');
    console.table(this.logHistory.slice(-20).map(entry => ({
      Time: entry.timestamp.toLocaleTimeString(),
      Level: LogLevel[entry.level],
      Category: entry.category,
      Message: entry.message,
    })));

    console.log('%cPerformance Metrics:', 'font-weight: bold;');
    console.table(this.performanceMetrics.slice(-20).map(metric => ({
      Name: metric.name,
      Duration: `${metric.duration.toFixed(2)}ms`,
      Time: metric.timestamp.toLocaleTimeString(),
    })));

    console.log('%cConfiguration:', 'font-weight: bold;');
    console.table({
      Enabled: this.enabled,
      'Log Level': LogLevel[this.currentLogLevel],
      'Active Categories': this.categories.size > 0 ? Array.from(this.categories).join(', ') : 'All',
      'History Size': this.logHistory.length,
      'Metrics Count': this.performanceMetrics.length,
    });

    console.groupEnd();
  }

  /**
   * Get logs filtered by criteria
   */
  getFilteredLogs(filter: {
    level?: LogLevel;
    category?: string;
    since?: Date;
    searchTerm?: string;
  }): LogEntry[] {
    let filtered = [...this.logHistory];

    if (filter.level !== undefined) {
      filtered = filtered.filter(log => log.level <= filter.level!);
    }

    if (filter.category) {
      filtered = filtered.filter(log => log.category === filter.category);
    }

    if (filter.since) {
      filtered = filtered.filter(log => log.timestamp >= filter.since!);
    }

    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(term) ||
        log.category.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      logs: this.logHistory,
      metrics: this.performanceMetrics,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Check if debug mode is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Singleton instance
export const debugLogger = new DebugLogger();

// Convenience exports
export const {
  error,
  warn,
  info,
  debug,
  trace,
  group,
  groupEnd,
  table,
  startTimer,
  componentMount,
  componentUnmount,
  componentUpdate,
  stateChange,
  apiRequest,
  apiResponse,
  routeChange,
  formValidation,
  userAction,
} = debugLogger;

// Export helper to wrap async functions with timing
export function withTiming<T extends (...args: any[]) => Promise<any>>(
  name: string,
  fn: T
): T {
  return (async (...args: any[]) => {
    const stopTimer = debugLogger.startTimer(name);
    try {
      const result = await fn(...args);
      stopTimer({ success: true });
      return result;
    } catch (error) {
      stopTimer({ success: false, error });
      throw error;
    }
  }) as T;
}

// Export helper for component debugging
export function debugComponent(componentName: string) {
  return {
    onMount: (props?: any) => debugLogger.componentMount(componentName, props),
    onUnmount: () => debugLogger.componentUnmount(componentName),
    onUpdate: (prevProps?: any, newProps?: any) => debugLogger.componentUpdate(componentName, prevProps, newProps),
  };
}
