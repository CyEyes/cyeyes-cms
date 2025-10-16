# 🔧 CyEyes CMS - Debug System Guide

## Tổng Quan

Hệ thống debug toàn diện cho frontend CyEyes CMS, giúp phát hiện và khắc phục lỗi nhanh chóng trong quá trình development.

## 🎯 Tính Năng

### 1. **Debug Logger** (`utils/debug.ts`)
- ✅ Multiple log levels (ERROR, WARN, INFO, DEBUG, TRACE)
- ✅ Category-based filtering
- ✅ Timestamp cho mọi log entry
- ✅ Stack trace tự động cho errors
- ✅ Performance timing utilities
- ✅ Component lifecycle tracking
- ✅ State change monitoring
- ✅ API request/response logging
- ✅ Export logs as JSON
- ✅ Console history (1000 entries)

### 2. **API Interceptors** (`services/api.ts`)
- ✅ Log tất cả API requests với method, URL, params, data
- ✅ Log API responses với status, data, duration
- ✅ Automatic error logging với chi tiết
- ✅ Performance monitoring (request duration)
- ✅ Token refresh tracking

### 3. **Error Boundary** (`components/ErrorBoundary.tsx`)
- ✅ Catch React rendering errors
- ✅ Display detailed error information in development
- ✅ Error stack trace
- ✅ Component stack trace
- ✅ User-friendly error UI
- ✅ Reset functionality
- ✅ Debug tips và suggestions

### 4. **Debug Panel UI** (`components/DebugPanel.tsx`)
- ✅ Floating debug panel (toggle với button hoặc Ctrl+D)
- ✅ Real-time log viewer với filtering
- ✅ Performance metrics display
- ✅ State inspection
- ✅ Filter logs by level và keyword
- ✅ Only visible in development hoặc với `?debug=true`

## 🚀 Kích Hoạt Debug Mode

### Development (Tự động)
Debug mode tự động enabled khi chạy `npm run dev`:
```bash
cd frontend
npm run dev
```

### Production (Manual)
Thêm `?debug=true` vào URL:
```
http://localhost?debug=true
http://localhost/admin?debug=true
```

## 📊 Sử Dụng Debug Logger

### Import
```typescript
import { debugLogger, debug, info, warn, error } from '@/utils/debug';
```

### Log Levels

```typescript
// ERROR - Critical errors
error('Category', 'Error message', { details });

// WARN - Warnings
warn('Category', 'Warning message', { data });

// INFO - General information
info('Category', 'Info message', { data });

// DEBUG - Debug information
debug('Category', 'Debug message', { data });

// TRACE - Detailed traces
trace('Category', 'Trace message', { data });
```

### Component Debugging

```typescript
import { debugComponent } from '@/utils/debug';

function MyComponent(props) {
  const debugHooks = debugComponent('MyComponent');

  useEffect(() => {
    debugHooks.onMount(props);
    return () => debugHooks.onUnmount();
  }, []);

  useEffect(() => {
    debugHooks.onUpdate(prevProps, props);
  }, [props]);

  return <div>...</div>;
}
```

### Performance Monitoring

```typescript
import { startTimer, withTiming } from '@/utils/debug';

// Manual timing
function handleAction() {
  const stopTimer = startTimer('Action Name');

  // ... do work ...

  stopTimer({ success: true, itemCount: 10 });
}

// Automatic timing for async functions
const fetchDataWithTiming = withTiming('Fetch Data', async () => {
  const response = await fetch('/api/data');
  return response.json();
});
```

### API Logging

API calls tự động được log qua interceptors. Không cần thêm code:

```typescript
// Automatically logged:
await api.get('/blogs');
// Console: 🚀 GET http://localhost:3000/api/blogs
// Console: ✅ GET http://localhost:3000/api/blogs (200) - 145ms

await api.post('/blogs', data);
// Console: 🚀 POST http://localhost:3000/api/blogs
// Console: ❌ POST http://localhost:3000/api/blogs (400) - 89ms
```

### State Changes

```typescript
import { stateChange } from '@/utils/debug';

function reducer(state, action) {
  const newState = {...state, ...action.payload};
  stateChange('MyReducer', state, newState);
  return newState;
}
```

### User Actions

```typescript
import { userAction } from '@/utils/debug';

function handleClick() {
  userAction('Button clicked', { buttonId: 'submit', page: 'login' });
  // ... handle click ...
}
```

### Form Validation

```typescript
import { formValidation } from '@/utils/debug';

function validateForm(data) {
  const errors = validate(data);
  formValidation('LoginForm', errors);
  return errors;
}
```

## 🎨 Debug Panel Usage

### Mở Debug Panel

**3 cách:**
1. Click floating button (góc dưới bên phải)
2. Nhấn `Ctrl + D`
3. Thêm `?debug=true` vào URL

### Tabs

#### 1. **Logs Tab**
- Hiển thị tất cả log entries (100 entries gần nhất)
- Filter theo keyword
- Filter theo log level (All, Error, Warn, Info, Debug)
- Click "Show data" để xem chi tiết
- Color-coded theo severity
- Icons cho mỗi log level

#### 2. **Performance Tab**
- Hiển thị performance metrics (50 metrics gần nhất)
- Duration với color coding:
  - 🟢 Green: < 500ms
  - 🟠 Orange: 500-1000ms
  - 🔴 Red: > 1000ms
- Timestamp cho mỗi metric
- Metadata nếu có

#### 3. **State Tab**
- Application state overview
- Environment information
- Total logs và metrics count
- Console commands reference
- Button "Dump State to Console"

## 💻 Console Commands

### Truy cập Debug API

```javascript
// Main debug object
window.__CYEYES_DEBUG__
```

### Available Commands

```javascript
// Get all log history
window.__CYEYES_DEBUG__.getHistory()

// Get performance metrics
window.__CYEYES_DEBUG__.getMetrics()

// Clear all logs và metrics
window.__CYEYES_DEBUG__.clearHistory()

// Set log level
window.__CYEYES_DEBUG__.setLevel(LogLevel.DEBUG)

// Enable specific category
window.__CYEYES_DEBUG__.enableCategory('API')

// Disable category
window.__CYEYES_DEBUG__.disableCategory('API')

// Get active categories
window.__CYEYES_DEBUG__.getCategories()

// Dump full state to console
window.__CYEYES_DEBUG__.dumpState()
```

### Export Logs

```javascript
// Export logs as JSON
const jsonData = window.__CYEYES_DEBUG__.logger.exportLogs();
console.log(jsonData);

// Or download
const blob = new Blob([jsonData], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'debug-logs.json';
a.click();
```

## 🔍 Debug Common Issues

### 1. API Call Failures

**Check Console:**
```javascript
// Look for API logs with ❌
// Check error response data
// Verify request headers và body

// Example output:
// 🚀 POST http://localhost:3000/api/blogs/admin
// ❌ POST http://localhost:3000/api/blogs/admin (400) - 89ms
//    error: { error: "Validation failed", details: {...} }
```

### 2. Component Rendering Issues

**Enable component logging:**
```typescript
import { debugComponent } from '@/utils/debug';

const debugHooks = debugComponent('ProblematicComponent');

// Logs will show:
// 🎨 ProblematicComponent mounted
// 🔄 ProblematicComponent updated
// 🗑️ ProblematicComponent unmounted
```

### 3. State Management Issues

**Track state changes:**
```typescript
import { stateChange } from '@/utils/debug';

// In reducer or state setter
stateChange('ComponentName', oldState, newState);

// Logs will show diff
// 📦 State changed in ComponentName
//    { prevState: {...}, newState: {...} }
```

### 4. Performance Bottlenecks

**Check Performance tab in Debug Panel:**
- Tìm entries với duration > 1000ms (red)
- Check API calls với long response times
- Identify slow components

**Or use console:**
```javascript
window.__CYEYES_DEBUG__.getMetrics()
  .filter(m => m.duration > 500)
  .sort((a, b) => b.duration - a.duration)
```

### 5. Error Boundary Catches

Khi Error Boundary catch error:
- ✅ Full error message displayed
- ✅ Error type shown
- ✅ Stack trace (development only)
- ✅ Component stack (development only)
- ✅ Debug tips provided
- ✅ Error logged to console với `window.__CYEYES_DEBUG__`

### 6. Network Errors

**Check logs for:**
```
❌ API Error: No response received
   { url: '...', error: 'Network Error' }
```

Possible causes:
- Backend không chạy
- CORS issues
- Invalid URL
- Network connectivity

## 📈 Best Practices

### 1. Use Appropriate Log Levels

```typescript
// ❌ Don't
debug('Component', 'Critical database error!');

// ✅ Do
error('Database', 'Connection failed', { code: 'ECONNREFUSED' });
```

### 2. Include Contextual Data

```typescript
// ❌ Don't
debug('API', 'Request failed');

// ✅ Do
debug('API', 'Request failed', {
  method: 'POST',
  url: '/api/blogs',
  status: 400,
  error: responseData
});
```

### 3. Use Categories Consistently

```typescript
// Standard categories:
// - Component: React component logs
// - API: API requests/responses
// - State: State management
// - Router: Navigation
// - Auth: Authentication
// - Form: Form validation
// - User: User actions
// - Debug: General debug info
```

### 4. Clean Up Logs in Production

Debug mode tự động tắt trong production (unless `?debug=true`).
Không cần remove debug calls.

### 5. Performance Monitoring

```typescript
// For long operations
const stopTimer = startTimer('Expensive Operation');
try {
  // ... operation ...
  stopTimer({ success: true });
} catch (error) {
  stopTimer({ success: false, error });
  throw error;
}
```

## 🐛 Troubleshooting

### Debug Panel không hiện

1. Check environment:
   ```javascript
   console.log(import.meta.env.DEV); // Should be true
   ```

2. Check URL có `?debug=true` không

3. Check console có error không

### Console commands không hoạt động

```javascript
// Check if debug is initialized
if (window.__CYEYES_DEBUG__) {
  console.log('Debug system initialized');
} else {
  console.log('Debug system not available');
}
```

### Logs không xuất hiện

1. Check log level:
   ```javascript
   window.__CYEYES_DEBUG__.setLevel(4); // TRACE level
   ```

2. Check categories:
   ```javascript
   // Enable all categories
   window.__CYEYES_DEBUG__.getCategories(); // Should be empty or include your category
   ```

## 📦 Files Structure

```
frontend/src/
├── utils/
│   └── debug.ts                    # Core debug logger
├── services/
│   └── api.ts                      # API interceptors với logging
├── components/
│   ├── ErrorBoundary.tsx           # Error boundary component
│   └── DebugPanel.tsx              # Debug UI panel
└── App.tsx                         # Integration point
```

## 🎓 Examples

### Example 1: Debug API Call

```typescript
import { api } from '@/services/api';
import { debug } from '@/utils/debug';

async function fetchBlogs() {
  debug('BlogService', 'Fetching blogs', { page: 1 });

  try {
    const response = await api.get('/blogs');
    debug('BlogService', 'Blogs fetched successfully', {
      count: response.data.length
    });
    return response.data;
  } catch (error) {
    // Auto-logged by API interceptor
    throw error;
  }
}
```

### Example 2: Debug Component Lifecycle

```typescript
import { useEffect } from 'react';
import { debugComponent } from '@/utils/debug';

function BlogList() {
  const debug = debugComponent('BlogList');

  useEffect(() => {
    debug.onMount({ initialLoad: true });
    return () => debug.onUnmount();
  }, []);

  return <div>...</div>;
}
```

### Example 3: Performance Monitoring

```typescript
import { startTimer } from '@/utils/debug';

async function complexCalculation() {
  const stopTimer = startTimer('Complex Calculation');

  // Heavy work here
  const result = await heavyComputation();

  stopTimer({
    resultSize: result.length,
    cacheHit: false
  });

  return result;
}
```

## 🔒 Security Notes

- ⚠️ Debug logs có thể chứa sensitive data
- ⚠️ Không enable debug mode trong production
- ⚠️ Sanitize data trước khi log nếu cần
- ✅ Debug mode tự động tắt khi deploy production
- ✅ `?debug=true` param có thể disable trong production build

## 📝 Summary

### Khi gặp lỗi:

1. **Mở Debug Panel** (Ctrl+D)
2. **Check Logs tab** - Tìm error messages
3. **Check Performance tab** - Identify slow operations
4. **Check Console** - Use `window.__CYEYES_DEBUG__.dumpState()`
5. **Check Network tab** - Verify API calls
6. **Check Error Boundary** - If React error occurred

### Debug workflow:

```
Error Occurs
    ↓
Check Error Boundary (if React error)
    ↓
Open Debug Panel (Ctrl+D)
    ↓
Filter logs by category/level
    ↓
Check API calls in Logs tab
    ↓
Check performance in Performance tab
    ↓
Use Console commands for deep dive
    ↓
Export logs if needed
```

---

**Happy Debugging! 🐛🔍**

Với hệ thống debug này, bạn có thể nhanh chóng phát hiện và khắc phục lỗi frontend, tracking performance issues, và debug API problems một cách hiệu quả!
