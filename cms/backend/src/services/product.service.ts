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
    customerValues: data.customerValues ? JSON.stringify(data.customerValues) : null,
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

  // Build update data, only including provided fields
  const updateData: Partial<NewProduct> = {};

  // Copy primitive fields if provided
  Object.keys(data).forEach((key) => {
    const value = (data as any)[key];
    if (value !== undefined && !['features', 'customerValues', 'images', 'pricing', 'relatedProducts'].includes(key)) {
      (updateData as any)[key] = value;
    }
  });

  // Handle JSON fields
  if (data.features !== undefined) {
    updateData.features = JSON.stringify(data.features);
  }
  if (data.customerValues !== undefined) {
    updateData.customerValues = JSON.stringify(data.customerValues);
  }
  if (data.images !== undefined) {
    updateData.images = JSON.stringify(data.images);
  }
  if (data.pricing !== undefined) {
    updateData.pricing = JSON.stringify(data.pricing);
  }
  if (data.relatedProducts !== undefined) {
    updateData.relatedProducts = JSON.stringify(data.relatedProducts);
  }

  updateData.updatedAt = new Date().toISOString();

  const result = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
  return parseProduct(result[0]);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const existing = await getProductById(id);
  if (!existing) throw new Error('Product not found');
  await db.delete(products).where(eq(products.id, id));
};

// Normalize feature to camelCase format
const normalizeFeature = (feature: any) => {
  return {
    titleEn: feature.titleEn || feature.title_en || '',
    titleVi: feature.titleVi || feature.title_vi || '',
    descEn: feature.descEn || feature.desc_en || undefined,
    descVi: feature.descVi || feature.desc_vi || undefined,
    icon: feature.icon || undefined,
  };
};

const parseProduct = (product: Product): Product => {
  const parsed = {
    ...product,
    features: product.features ? JSON.parse(product.features) : null,
    customerValues: product.customerValues ? JSON.parse(product.customerValues) : null,
    images: product.images ? JSON.parse(product.images) : null,
    pricing: product.pricing ? JSON.parse(product.pricing) : null,
    relatedProducts: product.relatedProducts ? JSON.parse(product.relatedProducts) : null,
  };

  // Normalize features to camelCase format
  if (parsed.features && Array.isArray(parsed.features)) {
    parsed.features = parsed.features.map(normalizeFeature);
  }

  // Normalize customer values to camelCase format
  if (parsed.customerValues && Array.isArray(parsed.customerValues)) {
    parsed.customerValues = parsed.customerValues.map(normalizeFeature);
  }

  return parsed;
};
