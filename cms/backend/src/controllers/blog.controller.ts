import { Request, Response } from 'express';
import {
  createBlogPost,
  getBlogPostById,
  getBlogPostBySlug,
  listBlogPosts,
  updateBlogPost,
  deleteBlogPost,
  incrementViewCount,
} from '../services/blog.service.js';
import type { CreateBlogRequest, UpdateBlogRequest, ListBlogsQuery, UuidParam, SlugParam } from '../schemas/blog.schema.js';

/**
 * Create blog post
 * POST /api/admin/blogs
 */
export const create = async (req: Request<object, object, CreateBlogRequest>, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const blog = await createBlogPost(req.body, req.user.userId);

    res.status(201).json({
      message: 'Blog post created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to create blog post',
    });
  }
};

/**
 * Get blog post by ID
 * GET /api/admin/blogs/:id
 */
export const getById = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    const blog = await getBlogPostById(req.params.id);

    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    res.json({ data: blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blog post' });
  }
};

/**
 * Get blog post by slug (public)
 * GET /api/blogs/:slug
 */
export const getBySlug = async (req: Request<SlugParam>, res: Response): Promise<void> => {
  try {
    const blog = await getBlogPostBySlug(req.params.slug);

    if (!blog) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Only show published posts to public
    if (blog.status !== 'published' && !req.user) {
      res.status(404).json({ error: 'Blog post not found' });
      return;
    }

    // Increment view count for published posts
    if (blog.status === 'published') {
      await incrementViewCount(blog.id);
    }

    res.json({ data: blog });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get blog post' });
  }
};

/**
 * List blog posts
 * GET /api/blogs (public - published only)
 * GET /api/admin/blogs (admin - all statuses)
 */
export const list = async (req: Request<object, object, object, ListBlogsQuery>, res: Response): Promise<void> => {
  try {
    const query = req.query;

    // If not authenticated, force status to published
    if (!req.user) {
      query.status = 'published';
    }

    const result = await listBlogPosts(query);

    res.json(result);
  } catch (error) {
    console.error('Error listing blog posts:', error);
    res.status(500).json({ error: 'Failed to list blog posts' });
  }
};

/**
 * Update blog post
 * PUT /api/admin/blogs/:id
 */
export const update = async (req: Request<UuidParam, object, UpdateBlogRequest>, res: Response): Promise<void> => {
  try {
    const blog = await updateBlogPost(req.params.id, req.body);

    res.json({
      message: 'Blog post updated successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to update blog post',
    });
  }
};

/**
 * Delete blog post
 * DELETE /api/admin/blogs/:id
 */
export const remove = async (req: Request<UuidParam>, res: Response): Promise<void> => {
  try {
    await deleteBlogPost(req.params.id);

    res.json({
      message: 'Blog post deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to delete blog post',
    });
  }
};
