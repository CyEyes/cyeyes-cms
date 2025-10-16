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
