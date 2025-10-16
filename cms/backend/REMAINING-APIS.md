# Remaining API Endpoints Implementation Guide

Blog API is complete as reference. The remaining APIs follow the same pattern.

## Pattern Structure

For each resource (Team, Customer, Product, Media, Admin):

```
schemas/[resource].schema.ts    -> Zod validation schemas
services/[resource].service.ts  -> Business logic + DB operations  
controllers/[resource].controller.ts -> Request handlers
routes/[resource].routes.ts     -> Route definitions
```

## Implementation Priority

### 1. Team API (NEXT - High Priority)
**Complexity:** Low
**Files needed:**
- `schemas/team.schema.ts` ✅ (created)
- `services/team.service.ts`
- `controllers/team.controller.ts`
- `routes/team.routes.ts`

**Endpoints:**
- `GET /api/team` - List active team members (public)
- `GET /api/team/:id` - Get team member (public)
- `POST /api/admin/team` - Create (content+)
- `PUT /api/admin/team/:id` - Update (content+)
- `DELETE /api/admin/team/:id` - Delete (content+)

**Key Features:**
- Bilingual content
- Department filtering
- Display order sorting
- Active/inactive status

---

### 2. Customer API (High Priority)
**Complexity:** Low
**Pattern:** Same as Team

**Endpoints:**
- `GET /api/customers` - List customers (public)
- `GET /api/customers/:id` - Get customer (public)
- `POST /api/admin/customers` - Create (content+)
- `PUT /api/admin/customers/:id` - Update (content+)
- `DELETE /api/admin/customers/:id` - Delete (content+)

**Key Features:**
- Case study JSON field
- Testimonial JSON field
- Homepage featured flag
- Display order

---

### 3. Product API (High Priority)
**Complexity:** Medium
**Pattern:** Similar to Blog (has slug)

**Endpoints:**
- `GET /api/products` - List products (public)
- `GET /api/products/:slug` - Get by slug (public)
- `POST /api/admin/products` - Create (content+)
- `PUT /api/admin/products/:id` - Update (content+)
- `DELETE /api/admin/products/:id` - Delete (content+)

**Key Features:**
- Slug-based URLs
- Features array (JSON)
- Images array (JSON)
- Pricing JSON
- Related products
- Category filtering

---

### 4. Media API (Medium Priority)
**Complexity:** High (file upload)
**Dependencies:** multer, sharp

**Endpoints:**
- `GET /api/media` - List media (content+)
- `POST /api/media/upload` - Upload file (content+)
- `PUT /api/media/:id` - Update metadata (content+)
- `DELETE /api/media/:id` - Delete file (content+)
- `GET /uploads/:filename` - Serve file (public)

**Key Features:**
- File validation (type, size)
- Image optimization (sharp)
- Thumbnail generation
- Folder organization
- File type detection
- Storage quota tracking

**Additional files needed:**
- `src/utils/file-upload.ts` - Multer config
- `src/utils/image-processor.ts` - Sharp operations

---

### 5. Admin API (Low Priority - Can wait)
**Complexity:** High
**Endpoints:**
- **Users:** CRUD, role changes
- **Settings:** Get/update config
- **Rate Limits:** Get/update limits
- **Analytics:** Dashboard stats
- **Audit Logs:** View security events
- **Traffic Logs:** View access logs

---

## Quick Implementation Script

Since Blog API is complete, you can:

1. **Duplicate & Modify:**
   ```bash
   # Copy blog files as template
   cp src/services/blog.service.ts src/services/team.service.ts
   # Then find-replace: blog->team, Blog->Team
   ```

2. **Use AI Assistant:**
   Ask to generate each API following the Blog API pattern

3. **Manual Implementation:**
   Follow the pattern for each resource

---

## Testing Checklist

After implementing each API:

- [ ] Public endpoints work without auth
- [ ] Admin endpoints require authentication
- [ ] RBAC permissions enforced correctly
- [ ] Input validation working (Zod)
- [ ] HTML sanitization applied
- [ ] Pagination works correctly
- [ ] Filters work correctly
- [ ] Error messages are helpful
- [ ] Rate limiting applied

---

## Quick Win: Just Need Blog + Auth?

If you want to launch quickly with minimal features:

**Keep:** Blog API + Auth API (already done)
**Skip:** Team, Customer, Product, Media
**Later:** Add other APIs incrementally

This gives you a functional CMS for blogging right away!

---

## Estimated Time

With Blog API as reference:
- Team API: ~30 min
- Customer API: ~30 min  
- Product API: ~45 min
- Media API: ~90 min (file upload complexity)
- Admin API: ~2 hours (multiple sub-resources)

**Total:** ~5 hours for all APIs

**Current status:** 
✅ Auth API (100%)
✅ Blog API (100%)
⏳ Others (0%)

---

Would you like me to:
1. Complete all APIs now (full implementation)?
2. Just add Team + Customer (high value, low effort)?
3. Skip to frontend and add APIs later?
4. Focus on Media API (needed for image uploads)?
