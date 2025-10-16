#!/bin/bash

# This script creates remaining API files
# Run: bash QUICK-APIS-SCRIPT.sh

echo "🚀 Creating Product Service..."
cat > src/services/product.service.ts << 'EOF'
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { products, type Product, type NewProduct } from '../models/index.js';
import { eq, and } from 'drizzle-orm';
import type { CreateProductRequest, UpdateProductRequest, ListProductsQuery } from '../schemas/product.schema.js';
import type { PaginationResult } from '../types/index.js';

export const createProduct = async (data: CreateProductRequest): Promise<Product> => {
  const existing = await db.select().from(products).where(eq(products.slug, data.slug)).get();
  if (existing) throw new Error('A product with this slug already exists');

  const newProduct: NewProduct = {
    id: uuidv4(),
    slug: data.slug,
    nameEn: data.nameEn,
    nameVi: data.nameVi,
    category: data.category || null,
    taglineEn: data.taglineEn || null,
    taglineVi: data.taglineVi || null,
    shortDescEn: data.shortDescEn || null,
    shortDescVi: data.shortDescVi || null,
    fullDescEn: data.fullDescEn || null,
    fullDescVi: data.fullDescVi || null,
    features: data.features ? JSON.stringify(data.features) : null,
    images: data.images ? JSON.stringify(data.images) : null,
    pricing: data.pricing ? JSON.stringify(data.pricing) : null,
    ctaTextEn: data.ctaTextEn || null,
    ctaTextVi: data.ctaTextVi || null,
    ctaLink: data.ctaLink || null,
    relatedProducts: data.relatedProducts ? JSON.stringify(data.relatedProducts) : null,
    isActive: data.isActive ?? true,
    displayOrder: data.displayOrder || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(products).values(newProduct).returning();
  return parseProduct(result[0]);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const product = await db.select().from(products).where(eq(products.id, id)).get();
  return product ? parseProduct(product) : undefined;
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const product = await db.select().from(products).where(eq(products.slug, slug)).get();
  return product ? parseProduct(product) : undefined;
};

export const listProducts = async (query: ListProductsQuery): Promise<PaginationResult<Product>> => {
  const { page, limit, category, isActive } = query;

  const conditions = [];
  if (category) conditions.push(eq(products.category, category));
  if (isActive !== undefined) conditions.push(eq(products.isActive, isActive));

  const allProducts = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const total = allProducts.length;
  const offset = (page - 1) * limit;

  const results = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(products.displayOrder)
    .limit(limit)
    .offset(offset);

  return {
    data: results.map(parseProduct),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const updateProduct = async (id: string, data: UpdateProductRequest): Promise<Product> => {
  const existing = await getProductById(id);
  if (!existing) throw new Error('Product not found');

  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await db.select().from(products).where(eq(products.slug, data.slug)).get();
    if (slugConflict) throw new Error('A product with this slug already exists');
  }

  const updateData: Partial<NewProduct> = {
    ...data,
    features: data.features ? JSON.stringify(data.features) : undefined,
    images: data.images ? JSON.stringify(data.images) : undefined,
    pricing: data.pricing ? JSON.stringify(data.pricing) : undefined,
    relatedProducts: data.relatedProducts ? JSON.stringify(data.relatedProducts) : undefined,
    updatedAt: new Date().toISOString(),
  };

  const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
  return parseProduct(result[0]);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const existing = await getProductById(id);
  if (!existing) throw new Error('Product not found');
  await db.delete(products).where(eq(products.id, id));
};

const parseProduct = (product: Product): Product => ({
  ...product,
  features: product.features ? JSON.parse(product.features) : null,
  images: product.images ? JSON.parse(product.images) : null,
  pricing: product.pricing ? JSON.parse(product.pricing) : null,
  relatedProducts: product.relatedProducts ? JSON.parse(product.relatedProducts) : null,
});
EOF

echo "✅ Product Service created"

echo "🚀 Creating Product Controller & Routes..."
cat > src/controllers/product.controller.ts << 'EOF'
import { Request, Response } from 'express';
import { createProduct, getProductById, getProductBySlug, listProducts, updateProduct, deleteProduct } from '../services/product.service.js';
import type { CreateProductRequest, UpdateProductRequest, ListProductsQuery } from '../schemas/product.schema.js';
import type { UuidParam, SlugParam } from '../schemas/blog.schema.js';

export const create = async (req: Request<object, object, CreateProductRequest>, res: Response): Promise<void> => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to create product' });
  }
};

export const getById = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const getBySlug = async (req: Request<SlugParam>, res: Response): Promise<void> => {
  try {
    const product = await getProductBySlug(req.params.slug);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    if (!product.isActive && !req.user) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const list = async (req: Request<object, object, object, ListProductsQuery>, res: Response): Promise<void> => {
  try {
    const query = { ...req.query };
    if (!req.user) query.isActive = true;
    const result = await listProducts(query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to list products' });
  }
};

export const update = async (req: Request<UuidParam, object, UpdateProductRequest>, res: Response): Promise<void> => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to update product' });
  }
};

export const remove = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to delete product' });
  }
};
EOF

cat > src/routes/product.routes.ts << 'EOF'
import { Router } from 'express';
import { create, getById, getBySlug, list, update, remove } from '../controllers/product.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { requireContentManager } from '../middleware/rbac.js';
import { validateBody, validateParams, validateQuery } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/error-handler.js';
import { sanitizeBody } from '../middleware/security.js';
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from '../schemas/product.schema.js';
import { uuidParamSchema, slugParamSchema } from '../schemas/blog.schema.js';

const router = Router();

// Public routes
router.get('/', optionalAuth, validateQuery(listProductsQuerySchema), asyncHandler(list));
router.get('/:slug', optionalAuth, validateParams(slugParamSchema), asyncHandler(getBySlug));

// Admin routes
router.post('/', authenticate, requireContentManager, validateBody(createProductSchema), sanitizeBody(['shortDescEn', 'shortDescVi', 'fullDescEn', 'fullDescVi']), asyncHandler(create));
router.put('/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), validateBody(updateProductSchema), sanitizeBody(['shortDescEn', 'shortDescVi', 'fullDescEn', 'fullDescVi']), asyncHandler(update));
router.delete('/:id', authenticate, requireContentManager, validateParams(uuidParamSchema), asyncHandler(remove));

export default router;
EOF

echo "✅ Product API complete!"
echo "✅ All core APIs created successfully!"
echo ""
echo "Next steps:"
echo "1. Update src/app.ts to register routes"
echo "2. Run: npm install"
echo "3. Run: npm run db:setup"
echo "4. Run: npm run dev"
