import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { blogService, BlogPost } from '@services/blog.service';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const data = await blogService.getBySlug(slug!);
      if (data.status !== 'published') {
        toast.error('Blog post not found');
        navigate('/blog');
        return;
      }
      setBlog(data);
    } catch (error) {
      toast.error('Blog post not found');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: isVi ? blog?.titleVi : blog?.titleEn,
        text: isVi ? blog?.excerptVi : blog?.excerptEn,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-text-secondary">{t('blog.loading')}</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Back Button */}
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-primary-cyan hover:text-accent-blue font-medium mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        {t('blog.backToList')}
      </Link>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="aspect-video w-full overflow-hidden rounded-xl mb-8">
          <img
            src={blog.featuredImage}
            alt={isVi ? blog.titleVi : blog.titleEn}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-5xl font-heading font-bold text-primary-navy mb-6">
        {isVi ? blog.titleVi : blog.titleEn}
      </h1>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-2 text-text-secondary">
          <User className="h-5 w-5" />
          <span>{blog.authorName}</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar className="h-5 w-5" />
          <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
        </div>
        <button
          onClick={handleShare}
          className="ml-auto flex items-center gap-2 text-primary-cyan hover:text-accent-blue"
        >
          <Share2 className="h-5 w-5" />
          {t('blog.share')}
        </button>
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag className="h-5 w-5 text-text-secondary" />
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-12 break-words overflow-hidden"
        dangerouslySetInnerHTML={{ __html: isVi ? blog.contentVi : blog.contentEn }}
      />

      {/* Bottom CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 rounded-xl border-l-4 border-primary-cyan">
        <h3 className="text-2xl font-heading font-bold text-primary-navy mb-3">
          {t('blog.interestedTitle')}
        </h3>
        <p className="text-text-secondary mb-6">{t('blog.interestedDesc')}</p>
        <div className="flex gap-4">
          <Link to="/contact" className="btn-primary">
            {t('blog.contactUs')}
          </Link>
          <Link to="/blog" className="btn-secondary">
            {t('blog.readMore')}
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}
