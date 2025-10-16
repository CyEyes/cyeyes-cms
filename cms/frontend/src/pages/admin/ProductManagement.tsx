import { useEffect, useState } from 'react';
import { productService, Product, CreateProductRequest, ProductFeature, ProductCustomerValue } from '@services/product.service';
import { Plus, Edit, Trash2, X, Save, Package as PackageIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleApiError } from '@utils/errorHandler';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    slug: '',
    nameEn: '',
    nameVi: '',
    category: '',
    taglineEn: '',
    taglineVi: '',
    shortDescEn: '',
    shortDescVi: '',
    fullDescEn: '',
    fullDescVi: '',
    features: [],
    customerValues: [],
    images: [],
    pricing: {},
    ctaTextEn: 'Learn More',
    ctaTextVi: 'Tìm hiểu thêm',
    ctaLink: '',
    isActive: true,
    displayOrder: 0,
  });

  // Feature editing
  const [featureInputEn, setFeatureInputEn] = useState('');
  const [featureInputVi, setFeatureInputVi] = useState('');
  const [featureDescEn, setFeatureDescEn] = useState('');
  const [featureDescVi, setFeatureDescVi] = useState('');
  const [featureIcon, setFeatureIcon] = useState('');

  // Customer Value editing
  const [valueInputEn, setValueInputEn] = useState('');
  const [valueInputVi, setValueInputVi] = useState('');
  const [valueDescEn, setValueDescEn] = useState('');
  const [valueDescVi, setValueDescVi] = useState('');
  const [valueIcon, setValueIcon] = useState('');

  // Image editing
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.list({ limit: 100 });
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        slug: product.slug,
        nameEn: product.nameEn,
        nameVi: product.nameVi,
        category: product.category || '',
        taglineEn: product.taglineEn || '',
        taglineVi: product.taglineVi || '',
        shortDescEn: product.shortDescEn || '',
        shortDescVi: product.shortDescVi || '',
        fullDescEn: product.fullDescEn || '',
        fullDescVi: product.fullDescVi || '',
        features: product.features || [],
        customerValues: product.customerValues || [],
        images: product.images || [],
        pricing: product.pricing || {},
        ctaTextEn: product.ctaTextEn || 'Learn More',
        ctaTextVi: product.ctaTextVi || 'Tìm hiểu thêm',
        ctaLink: product.ctaLink || '',
        isActive: product.isActive,
        displayOrder: product.displayOrder,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        slug: '',
        nameEn: '',
        nameVi: '',
        category: '',
        taglineEn: '',
        taglineVi: '',
        shortDescEn: '',
        shortDescVi: '',
        fullDescEn: '',
        fullDescVi: '',
        features: [],
        customerValues: [],
        images: [],
        pricing: {},
        ctaTextEn: 'Learn More',
        ctaTextVi: 'Tìm hiểu thêm',
        ctaLink: '',
        isActive: true,
        displayOrder: products.length,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFeatureInputEn('');
    setFeatureInputVi('');
    setFeatureDescEn('');
    setFeatureDescVi('');
    setFeatureIcon('');
    setValueInputEn('');
    setValueInputVi('');
    setValueDescEn('');
    setValueDescVi('');
    setValueIcon('');
    setImageInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
        toast.success('Product updated successfully');
      } else {
        await productService.create(formData);
        toast.success('Product created successfully');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      handleApiError(error, 'Failed to save product');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await productService.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const addFeature = () => {
    if (!featureInputEn.trim() || !featureInputVi.trim()) {
      toast.error('Please enter feature titles in both languages');
      return;
    }

    const newFeature: ProductFeature = {
      titleEn: featureInputEn.trim(),
      titleVi: featureInputVi.trim(),
      descEn: featureDescEn.trim() || undefined,
      descVi: featureDescVi.trim() || undefined,
      icon: featureIcon.trim() || undefined,
    };

    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeature],
    });

    setFeatureInputEn('');
    setFeatureInputVi('');
    setFeatureDescEn('');
    setFeatureDescVi('');
    setFeatureIcon('');
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
    });
  };

  const addCustomerValue = () => {
    if (!valueInputEn.trim() || !valueInputVi.trim()) {
      toast.error('Please enter customer value titles in both languages');
      return;
    }

    const newValue: ProductCustomerValue = {
      titleEn: valueInputEn.trim(),
      titleVi: valueInputVi.trim(),
      descEn: valueDescEn.trim() || undefined,
      descVi: valueDescVi.trim() || undefined,
      icon: valueIcon.trim() || undefined,
    };

    setFormData({
      ...formData,
      customerValues: [...(formData.customerValues || []), newValue],
    });

    setValueInputEn('');
    setValueInputVi('');
    setValueDescEn('');
    setValueDescVi('');
    setValueIcon('');
  };

  const removeCustomerValue = (index: number) => {
    setFormData({
      ...formData,
      customerValues: formData.customerValues?.filter((_, i) => i !== index) || [],
    });
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    setFormData({
      ...formData,
      images: [...(formData.images || []), imageInput.trim()],
    });
    setImageInput('');
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-navy">Products</h2>
          <p className="text-text-secondary mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="glass-card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary mt-4">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <PackageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">No products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.nameEn}
                  className="h-32 w-full object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="h-32 w-full rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {product.nameEn.charAt(0)}
                </div>
              )}

              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-heading font-bold text-primary-navy flex-1">
                  {product.nameEn}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="text-gray-600 hover:text-primary-cyan"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.nameEn)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {product.taglineEn && (
                <p className="text-sm text-primary-cyan mb-2 italic">{product.taglineEn}</p>
              )}

              <div className="flex items-center gap-2 mb-3">
                {product.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                    {product.category}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {product.shortDescEn && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {product.shortDescEn}
                </p>
              )}

              <div className="text-xs text-text-secondary mb-3 space-y-1">
                {product.features && product.features.length > 0 && (
                  <div>📋 {product.features.length} feature{product.features.length > 1 ? 's' : ''}</div>
                )}
                {product.customerValues && product.customerValues.length > 0 && (
                  <div>💎 {product.customerValues.length} customer value{product.customerValues.length > 1 ? 's' : ''}</div>
                )}
              </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200">
                <span className="text-xs text-text-secondary">Order: {product.displayOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-heading font-bold text-primary-navy">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="font-semibold text-text-primary mb-3">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tên (Tiếng Việt) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameVi}
                      onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tagline (English)
                    </label>
                    <input
                      type="text"
                      value={formData.taglineEn}
                      onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tagline (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={formData.taglineVi}
                      onChange={(e) => setFormData({ ...formData, taglineVi: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Descriptions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Short Description (English)
                    </label>
                    <textarea
                      value={formData.shortDescEn}
                      onChange={(e) => setFormData({ ...formData, shortDescEn: e.target.value })}
                      className="input-field"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Mô tả ngắn (Tiếng Việt)
                    </label>
                    <textarea
                      value={formData.shortDescVi}
                      onChange={(e) => setFormData({ ...formData, shortDescVi: e.target.value })}
                      className="input-field"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Description (English)
                    </label>
                    <textarea
                      value={formData.fullDescEn}
                      onChange={(e) => setFormData({ ...formData, fullDescEn: e.target.value })}
                      className="input-field"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Mô tả đầy đủ (Tiếng Việt)
                    </label>
                    <textarea
                      value={formData.fullDescVi}
                      onChange={(e) => setFormData({ ...formData, fullDescVi: e.target.value })}
                      className="input-field"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Features</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Feature Title (English)
                    </label>
                    <input
                      type="text"
                      value={featureInputEn}
                      onChange={(e) => setFeatureInputEn(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Real-time Monitoring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Tên tính năng (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={featureInputVi}
                      onChange={(e) => setFeatureInputVi(e.target.value)}
                      className="input-field"
                      placeholder="VD: Giám sát thời gian thực"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Description (English)
                    </label>
                    <input
                      type="text"
                      value={featureDescEn}
                      onChange={(e) => setFeatureDescEn(e.target.value)}
                      className="input-field"
                      placeholder="Optional description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Mô tả (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={featureDescVi}
                      onChange={(e) => setFeatureDescVi(e.target.value)}
                      className="input-field"
                      placeholder="Mô tả tùy chọn"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Icon (emoji or text)
                  </label>
                  <input
                    type="text"
                    value={featureIcon}
                    onChange={(e) => setFeatureIcon(e.target.value)}
                    className="input-field"
                    placeholder="e.g., 📊 or Dashboard"
                  />
                </div>

                <button
                  type="button"
                  onClick={addFeature}
                  className="btn-secondary mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </button>

                <div className="space-y-2">
                  {formData.features?.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {feature.icon && (
                        <div className="text-2xl">{feature.icon}</div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm text-text-primary">
                          {feature.titleEn} / {feature.titleVi}
                        </div>
                        {(feature.descEn || feature.descVi) && (
                          <div className="text-xs text-text-secondary mt-1">
                            {feature.descEn} / {feature.descVi}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Values */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Customer Values</h4>
                <p className="text-sm text-text-secondary mb-4">Value propositions that highlight what customers gain</p>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Value Title (English)
                    </label>
                    <input
                      type="text"
                      value={valueInputEn}
                      onChange={(e) => setValueInputEn(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Save Time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Tiêu đề giá trị (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={valueInputVi}
                      onChange={(e) => setValueInputVi(e.target.value)}
                      className="input-field"
                      placeholder="VD: Tiết kiệm thời gian"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Description (English)
                    </label>
                    <input
                      type="text"
                      value={valueDescEn}
                      onChange={(e) => setValueDescEn(e.target.value)}
                      className="input-field"
                      placeholder="e.g., Reduce manual work by 50%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Mô tả (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={valueDescVi}
                      onChange={(e) => setValueDescVi(e.target.value)}
                      className="input-field"
                      placeholder="VD: Giảm 50% công việc thủ công"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Icon (emoji or text)
                  </label>
                  <input
                    type="text"
                    value={valueIcon}
                    onChange={(e) => setValueIcon(e.target.value)}
                    className="input-field"
                    placeholder="e.g., ⏰ or 💰"
                  />
                </div>

                <button
                  type="button"
                  onClick={addCustomerValue}
                  className="btn-secondary mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Customer Value
                </button>

                <div className="space-y-2">
                  {formData.customerValues?.map((value, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-l-4 border-primary-cyan">
                      {value.icon && (
                        <div className="text-2xl">{value.icon}</div>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-sm text-primary-cyan">
                          {value.titleEn} / {value.titleVi}
                        </div>
                        {(value.descEn || value.descVi) && (
                          <div className="text-xs text-text-secondary mt-1">
                            {value.descEn} / {value.descVi}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCustomerValue(i)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Images</h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="btn-primary px-4"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {formData.images?.map((image, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={image}
                        alt={`Product ${i + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Call to Action</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      CTA Text (English)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaTextEn}
                      onChange={(e) => setFormData({ ...formData, ctaTextEn: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      CTA Text (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={formData.ctaTextVi}
                      onChange={(e) => setFormData({ ...formData, ctaTextVi: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      CTA Link
                    </label>
                    <input
                      type="url"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-text-primary mb-3">Settings</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-primary-cyan focus:ring-primary-cyan rounded"
                      />
                      <span className="text-sm font-medium text-text-primary">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary inline-flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
