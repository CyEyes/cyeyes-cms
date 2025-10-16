import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogService, BlogPost, ListBlogsParams } from '@services/blog.service';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Archive,
  CheckCircle,
  Clock,
  FileX,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogManagement() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params: ListBlogsParams = { page, limit };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await blogService.listAdmin(params);
      setBlogs(response.data);
      setTotal(response.total);
    } catch (error) {
      toast.error('Failed to load blogs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, statusFilter]);

  const handleSearch = () => {
    setPage(1);
    fetchBlogs();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await blogService.delete(id);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
      console.error(error);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await blogService.publish(id);
      toast.success('Blog published successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to publish blog');
      console.error(error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await blogService.archive(id);
      toast.success('Blog archived successfully');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to archive blog');
      console.error(error);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
      published: { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: 'Published' },
      archived: { icon: FileX, color: 'bg-gray-100 text-gray-800', label: 'Archived' },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-navy">Blog Posts</h2>
          <p className="text-text-secondary mt-1">Manage your blog content</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="btn-primary inline-flex items-center gap-2 justify-center"
        >
          <Plus className="h-5 w-5" />
          Create Blog Post
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-primary-cyan"
            />
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary px-6"
          >
            Search
          </button>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-cyan focus:border-primary-cyan"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto"></div>
            <p className="text-text-secondary mt-4">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 text-center">
            <FileX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-text-secondary">No blogs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.featuredImage && (
                          <img
                            src={blog.featuredImage}
                            alt={blog.titleEn}
                            className="h-10 w-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-text-primary">{blog.titleEn}</div>
                          <div className="text-sm text-text-secondary">{blog.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {blog.authorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(blog.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags && blog.tags.length > 0 ? (
                          <>
                            {blog.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-text-muted">No tags</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${blog.slug}`}
                          target="_blank"
                          className="text-gray-600 hover:text-primary-cyan"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/admin/blogs/edit/${blog.id}`}
                          className="text-gray-600 hover:text-primary-cyan"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        {blog.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(blog.id)}
                            className="text-green-600 hover:text-green-700"
                            title="Publish"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {blog.status === 'published' && (
                          <button
                            onClick={() => handleArchive(blog.id)}
                            className="text-orange-600 hover:text-orange-700"
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(blog.id, blog.titleEn)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= total}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
