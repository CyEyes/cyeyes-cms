import { useState, useEffect } from 'react';
import { debugLogger, LogLevel } from '@/utils/debug';
import { X, Terminal, Activity, Clock, AlertCircle, Info, Bug, Zap } from 'lucide-react';

interface DebugPanelProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function DebugPanel({ position = 'bottom-right' }: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'performance' | 'state'>('logs');
  const [logs, setLogs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<LogLevel | null>(null);

  // Only show in development or when debug=true
  const isDev = import.meta.env.DEV;
  const hasDebugParam = new URLSearchParams(window.location.search).has('debug');
  const shouldShow = isDev || hasDebugParam;

  useEffect(() => {
    if (!shouldShow) return;

    // Refresh logs and metrics every second when panel is open
    if (isOpen) {
      const interval = setInterval(() => {
        const debugData = (window as any).__CYEYES_DEBUG__;
        if (debugData) {
          setLogs(debugData.getHistory().slice(-100).reverse());
          setMetrics(debugData.getMetrics().slice(-50).reverse());
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, shouldShow]);

  if (!shouldShow) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== null && log.level > levelFilter) return false;
    if (filter && !log.message.toLowerCase().includes(filter.toLowerCase()) && !log.category.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getLevelColor = (level: LogLevel) => {
    const colors = {
      [LogLevel.ERROR]: 'text-red-500',
      [LogLevel.WARN]: 'text-orange-500',
      [LogLevel.INFO]: 'text-blue-500',
      [LogLevel.DEBUG]: 'text-green-500',
      [LogLevel.TRACE]: 'text-gray-500',
    };
    return colors[level] || 'text-gray-500';
  };

  const getLevelIcon = (level: LogLevel) => {
    const icons = {
      [LogLevel.ERROR]: <AlertCircle className="w-4 h-4" />,
      [LogLevel.WARN]: <AlertCircle className="w-4 h-4" />,
      [LogLevel.INFO]: <Info className="w-4 h-4" />,
      [LogLevel.DEBUG]: <Bug className="w-4 h-4" />,
      [LogLevel.TRACE]: <Zap className="w-4 h-4" />,
    };
    return icons[level] || <Info className="w-4 h-4" />;
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} z-50 bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110`}
          title="Open Debug Panel"
        >
          <Terminal className="w-5 h-5" />
        </button>
      )}

      {/* Debug Panel */}
      {isOpen && (
        <div
          className={`fixed ${positionClasses[position]} z-50 w-[600px] max-w-[90vw] max-h-[80vh] bg-gray-900 text-white rounded-lg shadow-2xl flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-600 to-blue-600 border-b border-cyan-500">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              <h3 className="font-bold">CyEyes Debug Panel</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 px-4 py-2 font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Terminal className="w-4 h-4" />
                Logs ({logs.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('performance')}
              className={`flex-1 px-4 py-2 font-medium transition-colors ${
                activeTab === 'performance'
                  ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Activity className="w-4 h-4" />
                Performance ({metrics.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`flex-1 px-4 py-2 font-medium transition-colors ${
                activeTab === 'state'
                  ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                State
              </div>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Logs Tab */}
            {activeTab === 'logs' && (
              <>
                {/* Filters */}
                <div className="p-3 bg-gray-800 border-b border-gray-700 space-y-2">
                  <input
                    type="text"
                    placeholder="Filter logs..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <div className="flex gap-2">
                    {[
                      { level: null, label: 'All' },
                      { level: LogLevel.ERROR, label: 'Error' },
                      { level: LogLevel.WARN, label: 'Warn' },
                      { level: LogLevel.INFO, label: 'Info' },
                      { level: LogLevel.DEBUG, label: 'Debug' },
                    ].map(({ level, label }) => (
                      <button
                        key={label}
                        onClick={() => setLevelFilter(level)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          levelFilter === level
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Log List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
                  {filteredLogs.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No logs to display</div>
                  ) : (
                    filteredLogs.map((log, idx) => (
                      <div key={idx} className="bg-gray-800 rounded p-2 hover:bg-gray-750 transition-colors">
                        <div className="flex items-start gap-2">
                          <div className={getLevelColor(log.level)}>{getLevelIcon(log.level)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="text-cyan-400 font-bold">[{log.category}]</span>
                              <span className={`text-xs ${getLevelColor(log.level)}`}>
                                {LogLevel[log.level]}
                              </span>
                            </div>
                            <div className="text-white">{log.message}</div>
                            {log.data && (
                              <details className="mt-1">
                                <summary className="text-gray-400 cursor-pointer hover:text-gray-300">
                                  Show data
                                </summary>
                                <pre className="mt-1 text-xs text-green-400 overflow-x-auto">
                                  {typeof log.data === 'object'
                                    ? JSON.stringify(log.data, null, 2)
                                    : String(log.data)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
                {metrics.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No performance metrics</div>
                ) : (
                  metrics.map((metric, idx) => {
                    const color =
                      metric.duration > 1000 ? 'text-red-400' : metric.duration > 500 ? 'text-orange-400' : 'text-green-400';
                    return (
                      <div key={idx} className="bg-gray-800 rounded p-2 hover:bg-gray-750 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-white">{metric.name}</span>
                          <span className={`font-bold ${color}`}>{metric.duration.toFixed(2)}ms</span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">
                          {new Date(metric.timestamp).toLocaleTimeString()}
                        </div>
                        {metric.metadata && (
                          <pre className="mt-1 text-xs text-gray-400">
                            {JSON.stringify(metric.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* State Tab */}
            {activeTab === 'state' && (
              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-3">
                  <div className="bg-gray-800 rounded p-3">
                    <h4 className="font-bold text-cyan-400 mb-2">Application State</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Environment:</span>
                        <span className="text-white">{import.meta.env.MODE}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Debug Mode:</span>
                        <span className="text-green-400">Enabled</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Logs:</span>
                        <span className="text-white">{logs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Metrics:</span>
                        <span className="text-white">{metrics.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded p-3">
                    <h4 className="font-bold text-cyan-400 mb-2">Console Commands</h4>
                    <div className="text-xs space-y-1 font-mono">
                      <div className="text-gray-300">
                        <span className="text-cyan-400">window.__CYEYES_DEBUG__</span>
                        <span className="text-gray-500">.dumpState()</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-cyan-400">window.__CYEYES_DEBUG__</span>
                        <span className="text-gray-500">.getHistory()</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-cyan-400">window.__CYEYES_DEBUG__</span>
                        <span className="text-gray-500">.clearHistory()</span>
                      </div>
                      <div className="text-gray-300">
                        <span className="text-cyan-400">window.__CYEYES_DEBUG__</span>
                        <span className="text-gray-500">.getMetrics()</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      (window as any).__CYEYES_DEBUG__?.dumpState();
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded transition-colors font-medium"
                  >
                    Dump State to Console
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400 text-center">
            Press <kbd className="px-1 bg-gray-700 rounded">Ctrl+D</kbd> to toggle panel
          </div>
        </div>
      )}
    </>
  );
}

// Keyboard shortcut to toggle panel
if (typeof window !== 'undefined') {
  let panelOpen = false;
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      panelOpen = !panelOpen;
      // This is a simple toggle, in real app you'd use state management
      const button = document.querySelector('[title="Open Debug Panel"]') as HTMLButtonElement;
      if (button) button.click();
    }
  });
}

export default DebugPanel;
