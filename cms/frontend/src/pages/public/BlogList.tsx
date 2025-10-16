import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogService, BlogPost } from '@services/blog.service';
import { Calendar, User, Tag, Search, FileText } from 'lucide-react';

export default function BlogListPage() {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await blogService.list({
        page,
        limit,
        status: 'published',
        search: search || undefined,
      });
      setBlogs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to load blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchBlogs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-heading font-bold text-primary-navy mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('blog.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-primary-cyan"
            />
          </div>
          <button onClick={handleSearch} className="btn-primary px-8">
            {t('blog.searchBtn')}
          </button>
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">{t('blog.loading')}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary text-lg">{t('blog.noPosts')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug}`}
                className="glass-card overflow-hidden hover:shadow-xl transition-shadow group"
              >
                {blog.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={blog.featuredImage}
                      alt={isVi ? blog.titleVi : blog.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-heading font-bold text-primary-navy mb-3 line-clamp-2 group-hover:text-primary-cyan transition-colors">
                    {isVi ? blog.titleVi : blog.titleEn}
                  </h2>
                  <p className="text-text-secondary mb-4 line-clamp-3">
                    {isVi ? blog.excerptVi : blog.excerptEn}
                  </p>

                  {/* Meta */}
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{blog.authorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-4 w-4" />
                        {blog.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {t('blog.previous')}
              </button>
              <span className="text-text-secondary">
                {t('blog.page')} {page} / {Math.ceil(total / limit)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= total}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {t('blog.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
