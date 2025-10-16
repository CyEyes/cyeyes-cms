import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { blogPosts, type BlogPost, type NewBlogPost } from '../models/index.js';
import { eq, like, or, and, desc, asc, sql } from 'drizzle-orm';
import type { CreateBlogRequest, UpdateBlogRequest, ListBlogsQuery } from '../schemas/blog.schema.js';
import type { PaginationResult } from '../types/index.js';

/**
 * Create blog post
 */
export const createBlogPost = async (data: CreateBlogRequest, authorId: string): Promise<BlogPost> => {
  // Check if slug already exists
  const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug)).get();

  if (existing) {
    throw new Error('A blog post with this slug already exists');
  }

  const newBlog: NewBlogPost = {
    id: uuidv4(),
    slug: data.slug,
    titleEn: data.titleEn,
    titleVi: data.titleVi,
    contentEn: data.contentEn,
    contentVi: data.contentVi,
    excerptEn: data.excerptEn || null,
    excerptVi: data.excerptVi || null,
    featuredImage: data.featuredImage || null,
    authorId,
    category: data.category || null,
    tags: data.tags ? JSON.stringify(data.tags) : null,
    status: data.status || 'draft',
    publishedAt: data.publishedAt || null,
    seoTitleEn: data.seoTitleEn || null,
    seoTitleVi: data.seoTitleVi || null,
    seoDescEn: data.seoDescEn || null,
    seoDescVi: data.seoDescVi || null,
    seoKeywords: data.seoKeywords ? JSON.stringify(data.seoKeywords) : null,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await db.insert(blogPosts).values(newBlog).returning();
  return parseBlogPost(result[0]);
};

/**
 * Get blog post by ID
 */
export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
  const post = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).get();
  return post ? parseBlogPost(post) : undefined;
};

/**
 * Get blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const post = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).get();
  return post ? parseBlogPost(post) : undefined;
};

/**
 * List blog posts with filtering and pagination
 */
export const listBlogPosts = async (query: ListBlogsQuery): Promise<PaginationResult<BlogPost>> => {
  const { page, limit, status, category, tags, search, sortBy, sortOrder } = query;

  console.log('listBlogPosts query:', JSON.stringify(query));

  // Build where conditions
  const conditions = [];

  if (status) {
    conditions.push(eq(blogPosts.status, status));
  }

  if (category) {
    conditions.push(eq(blogPosts.category, category));
  }

  if (tags) {
    const tagArray = tags.split(',');
    const tagConditions = tagArray.map((tag) => like(blogPosts.tags, `%${tag}%`));
    conditions.push(or(...tagConditions));
  }

  if (search) {
    conditions.push(
      or(
        like(blogPosts.titleEn, `%${search}%`),
        like(blogPosts.titleVi, `%${search}%`),
        like(blogPosts.contentEn, `%${search}%`),
        like(blogPosts.contentVi, `%${search}%`)
      )
    );
  }

  // Build sort order
  const orderBy = sortOrder === 'asc' ? asc(blogPosts[sortBy]) : desc(blogPosts[sortBy]);

  // Build where clause
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogPosts)
    .where(whereClause)
    .get();

  const total = totalResult?.count || 0;

  // Get paginated results
  const offset = (page - 1) * limit;
  const posts = await db
    .select()
    .from(blogPosts)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return {
    data: posts.map(parseBlogPost),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Update blog post
 */
export const updateBlogPost = async (id: string, data: UpdateBlogRequest): Promise<BlogPost> => {
  // Check if post exists
  const existing = await getBlogPostById(id);
  if (!existing) {
    throw new Error('Blog post not found');
  }

  // If slug is being changed, check for conflicts
  if (data.slug && data.slug !== existing.slug) {
    const slugConflict = await db.select().from(blogPosts).where(eq(blogPosts.slug, data.slug)).get();
    if (slugConflict) {
      throw new Error('A blog post with this slug already exists');
    }
  }

  const updateData: Partial<NewBlogPost> = {
    ...data,
    tags: data.tags ? JSON.stringify(data.tags) : undefined,
    seoKeywords: data.seoKeywords ? JSON.stringify(data.seoKeywords) : undefined,
    updatedAt: new Date().toISOString(),
  };

  const result = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning();

  return parseBlogPost(result[0]);
};

/**
 * Delete blog post
 */
export const deleteBlogPost = async (id: string): Promise<void> => {
  const existing = await getBlogPostById(id);
  if (!existing) {
    throw new Error('Blog post not found');
  }

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
};

/**
 * Increment view count
 */
export const incrementViewCount = async (id: string): Promise<void> => {
  await db
    .update(blogPosts)
    .set({ viewCount: sql`${blogPosts.viewCount} + 1` })
    .where(eq(blogPosts.id, id));
};

/**
 * Parse blog post (convert JSON strings to objects)
 */
const parseBlogPost = (post: BlogPost): BlogPost => {
  return {
    ...post,
    tags: post.tags ? JSON.parse(post.tags) : null,
    seoKeywords: post.seoKeywords ? JSON.parse(post.seoKeywords) : null,
  };
};
