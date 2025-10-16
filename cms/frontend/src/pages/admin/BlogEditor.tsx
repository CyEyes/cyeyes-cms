import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { blogService, CreateBlogRequest } from '@services/blog.service';
import {
  Save,
  X,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { handleApiError } from '@utils/errorHandler';

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<CreateBlogRequest>({
    slug: '',
    titleEn: '',
    titleVi: '',
    excerptEn: '',
    excerptVi: '',
    contentEn: '',
    contentVi: '',
    featuredImage: '',
    status: 'draft',
    tags: [],
    category: '',
    seoTitleEn: '',
    seoTitleVi: '',
    seoDescEn: '',
    seoDescVi: '',
    seoKeywords: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en');

  const editorEn = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your blog post in English...' }),
    ],
    content: formData.contentEn,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentEn: editor.getHTML() }));
    },
  });

  const editorVi = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Bắt đầu viết bài blog bằng tiếng Việt...' }),
    ],
    content: formData.contentVi,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, contentVi: editor.getHTML() }));
    },
  });

  const currentEditor = activeTab === 'en' ? editorEn : editorVi;

  useEffect(() => {
    if (isEdit && id) {
      loadBlog();
    }
  }, [id]);

  const loadBlog = async () => {
    try {
      const blog = await blogService.getById(id!);
      setFormData({
        slug: blog.slug,
        titleEn: blog.titleEn,
        titleVi: blog.titleVi,
        excerptEn: blog.excerptEn,
        excerptVi: blog.excerptVi,
        contentEn: blog.contentEn,
        contentVi: blog.contentVi,
        featuredImage: blog.featuredImage,
        status: blog.status === 'archived' ? 'draft' : blog.status,
        tags: blog.tags,
        seoTitleEn: blog.seoTitleEn,
        seoTitleVi: blog.seoTitleVi,
        seoDescEn: blog.seoDescEn,
        seoDescVi: blog.seoDescVi,
      });
      editorEn?.commands.setContent(blog.contentEn);
      editorVi?.commands.setContent(blog.contentVi);
    } catch (error) {
      toast.error('Failed to load blog');
      navigate('/admin/blogs');
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!formData.slug || !formData.titleEn || !formData.titleVi) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const data = { ...formData, status };
      if (isEdit) {
        await blogService.update(id!, data);
        toast.success('Blog updated successfully');
      } else {
        await blogService.create(data);
        toast.success('Blog created successfully');
      }
      navigate('/admin/blogs');
    } catch (error: any) {
      handleApiError(error, 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url && currentEditor) {
      currentEditor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url && currentEditor) {
      currentEditor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold text-primary-navy">
          {isEdit ? 'Edit Blog Post' : 'Create Blog Post'}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/blogs')}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <X className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={() => handleSubmit('draft')}
            disabled={loading}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={loading}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Eye className="h-5 w-5" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input-field"
                placeholder="blog-post-url"
              />
            </div>

            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'en'
                    ? 'text-primary-cyan border-b-2 border-primary-cyan'
                    : 'text-gray-500'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setActiveTab('vi')}
                className={`px-4 py-2 font-medium ${
                  activeTab === 'vi'
                    ? 'text-primary-cyan border-b-2 border-primary-cyan'
                    : 'text-gray-500'
                }`}
              >
                Tiếng Việt
              </button>
            </div>

            {activeTab === 'en' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    className="input-field"
                    placeholder="Enter blog title in English"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Excerpt (English)
                  </label>
                  <textarea
                    value={formData.excerptEn}
                    onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Short description in English"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Tiêu đề (Tiếng Việt) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titleVi}
                    onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                    className="input-field"
                    placeholder="Nhập tiêu đề bài viết"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Trích dẫn (Tiếng Việt)
                  </label>
                  <textarea
                    value={formData.excerptVi}
                    onChange={(e) => setFormData({ ...formData, excerptVi: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Mô tả ngắn bằng tiếng Việt"
                  />
                </div>
              </>
            )}
          </div>

          {/* Editor */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Content ({activeTab === 'en' ? 'English' : 'Tiếng Việt'})
            </label>

            {/* Editor Toolbar */}
            <div className="flex flex-wrap gap-1 mb-3 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <button
                onClick={() => currentEditor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('bold') ? 'bg-gray-300' : ''
                }`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentEditor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('italic') ? 'bg-gray-300' : ''
                }`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentEditor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('bulletList') ? 'bg-gray-300' : ''
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentEditor?.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('orderedList') ? 'bg-gray-300' : ''
                }`}
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentEditor?.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('blockquote') ? 'bg-gray-300' : ''
                }`}
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={() => currentEditor?.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-gray-200 ${
                  currentEditor?.isActive('codeBlock') ? 'bg-gray-300' : ''
                }`}
              >
                <Code className="h-4 w-4" />
              </button>
              <button onClick={addLink} className="p-2 rounded hover:bg-gray-200">
                <LinkIcon className="h-4 w-4" />
              </button>
              <button onClick={addImage} className="p-2 rounded hover:bg-gray-200">
                <ImageIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Editor Content */}
            <div className="prose max-w-none border border-gray-300 rounded-lg p-4 min-h-[400px] focus-within:ring-2 focus-within:ring-primary-cyan focus-within:border-primary-cyan">
              <EditorContent editor={currentEditor} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Featured Image
            </label>
            <input
              type="text"
              value={formData.featuredImage}
              onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              className="input-field"
              placeholder="Image URL"
            />
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt="Preview"
                className="mt-3 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Tags */}
          <div className="glass-card p-6">
            <label className="block text-sm font-medium text-text-primary mb-2">Tags</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="input-field flex-1"
                placeholder="Add tag"
              />
              <button onClick={handleAddTag} className="btn-primary px-4">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="hover:text-blue-900">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-text-primary mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  SEO Title (EN)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleEn}
                  onChange={(e) => setFormData({ ...formData, seoTitleEn: e.target.value })}
                  className="input-field text-sm"
                  placeholder="SEO title in English"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  SEO Title (VI)
                </label>
                <input
                  type="text"
                  value={formData.seoTitleVi}
                  onChange={(e) => setFormData({ ...formData, seoTitleVi: e.target.value })}
                  className="input-field text-sm"
                  placeholder="Tiêu đề SEO tiếng Việt"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Meta Description (EN)
                </label>
                <textarea
                  value={formData.seoDescEn}
                  onChange={(e) => setFormData({ ...formData, seoDescEn: e.target.value })}
                  className="input-field text-sm"
                  rows={2}
                  placeholder="Meta description in English"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Meta Description (VI)
                </label>
                <textarea
                  value={formData.seoDescVi}
                  onChange={(e) => setFormData({ ...formData, seoDescVi: e.target.value })}
                  className="input-field text-sm"
                  rows={2}
                  placeholder="Mô tả meta tiếng Việt"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
