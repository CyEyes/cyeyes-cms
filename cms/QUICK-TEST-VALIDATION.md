# Quick Test: Validation Error Display

## Prerequisites

- CMS running at http://localhost
- Backend running at http://localhost:3000
- Fresh browser session (clear localStorage first)

## Test Steps

### Step 1: Login
1. Open http://localhost/login
2. Enter credentials:
   - Email: `admin@cyeyes.com`
   - Password: `Admin123!`
3. Click **Login**
4. Should redirect to Dashboard

### Step 2: Navigate to Blog Editor
1. Click **Blogs** in sidebar
2. Click **Create New Blog** button (top right)

### Step 3: Create Invalid Blog Post

Fill in the form with **intentionally invalid data**:

**Basic Info:**
- Slug: `test-validation`
- Title (English): `Test Validation Errors`
- Title (Tiếng Việt): `Kiểm tra lỗi validation`
- Excerpt (English): Leave **EMPTY** or add more than 500 characters
- Excerpt (Tiếng Việt): Leave **EMPTY** or add more than 500 characters

**Content:**
- **IMPORTANT:** Leave both English and Vietnamese content editors **COMPLETELY EMPTY**

### Step 4: Trigger Validation

Click the **Publish** button (blue button with eye icon)

### Expected Result

You should see a toast notification appear in the **top-right corner** with:

```
Validation Failed:
• contentEn: English content is required
• contentVi: Vietnamese content is required
• excerptEn: String must contain at most 500 character(s)  (if you added >500 chars)
• excerptVi: String must contain at most 500 character(s)  (if you added >500 chars)
```

**Toast Properties:**
- Duration: 6 seconds (enough time to read all errors)
- Color: Red background (error toast)
- Position: Top-right
- Multi-line format
- Left-aligned text
- Bullet points for each error

### Step 5: Fix Validation Errors

1. Switch to **English** tab
2. Type some content in the editor (e.g., "This is test content")
3. Switch to **Tiếng Việt** tab
4. Type some content in the editor (e.g., "Đây là nội dung thử nghiệm")
5. If excerpts are too long, shorten them to under 500 characters

### Step 6: Successful Save

Click **Publish** again

**Expected Result:**
- ✅ Toast notification: "Blog created successfully" (green)
- ✅ Redirect to Blog Management page
- ✅ Your new blog appears in the list

## Additional Test Cases

### Test Case 2: Login Validation

1. Logout (click user icon → Logout)
2. Go to http://localhost/login
3. Enter invalid credentials:
   - Email: `admin@cyeyes.com`
   - Password: `wrongpassword`
4. Click **Login**

**Expected Result:**
```
Invalid email or password
```

### Test Case 3: Customer Validation

1. Go to **Admin → Customers**
2. Click **Add Customer**
3. Leave required fields empty
4. Click **Save**

**Expected Result:**
- Toast shows validation errors for missing fields

## Debugging

### If validation errors don't appear:

1. **Check browser console** (F12 → Console tab)
   - Look for debug logs: `[ERROR] [API] ❌ POST ...`
   - Check error response structure

2. **Verify backend response:**
   ```bash
   curl -X POST http://localhost:3000/api/blogs/admin \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"slug":"test","titleEn":"Test","titleVi":"Test"}'
   ```

   Should return:
   ```json
   {
     "error": "Validation failed",
     "details": [
       {"field": "contentEn", "message": "English content is required"},
       {"field": "contentVi", "message": "Vietnamese content is required"}
     ]
   }
   ```

3. **Check frontend build:**
   ```bash
   docker compose logs frontend --tail 50
   ```

4. **Verify errorHandler was loaded:**
   - Open browser console
   - Type: `console.log(window.__CYEYES_DEBUG__)`
   - Should show debug utilities

## Success Criteria

✅ Validation errors show in toast notification
✅ All field errors displayed at once (not one-by-one)
✅ Toast stays visible for 6 seconds
✅ Error messages are clear and specific
✅ User can fix errors and successfully submit

## Common Issues

### Issue: Toast appears too fast
**Solution:** Duration is set to 6 seconds for validation errors. If still too fast, increase in `errorHandler.ts`

### Issue: Generic error shown instead of validation details
**Solution:** Check that backend returns `error: "Validation failed"` and `details` array

### Issue: No toast appears at all
**Solution:**
1. Check browser console for errors
2. Verify `react-hot-toast` is working (test with manual `toast.error("test")`)
3. Check if error is being caught properly

### Issue: Chrome extension errors in console
**These can be ignored:**
```
Unchecked runtime.lastError: The message port closed...
No tab with id: xxx
```

These are from browser extensions, not from CMS.

---

**Test Duration:** ~2 minutes
**Last Updated:** 2025-10-14
**Status:** ✅ Working
