import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService, Product } from '@services/product.service';
import { ArrowLeft, Check, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getBySlug(slug!);
      if (!data.isActive) {
        toast.error('Product not found');
        navigate('/products');
        return;
      }
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const getPriceDisplay = (pricing?: Product['pricing']) => {
    if (!pricing) return t('products.contactUs');
    if (pricing.type === 'free') return t('products.free');
    if (pricing.type === 'contact') return t('products.contactUs');
    if (pricing.type === 'paid' && pricing.amount) {
      return `${pricing.currency || '$'}${pricing.amount}`;
    }
    if (pricing.type === 'subscription' && pricing.amount) {
      return `${pricing.currency || '$'}${pricing.amount}/${t(`products.${pricing.interval || 'monthly'}`)}`;
    }
    return 'N/A';
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images!.length) % product.images!.length);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-text-secondary">{t('products.loading')}</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productName = isVi ? product.nameVi : product.nameEn;
  const productTagline = isVi ? product.taglineVi : product.taglineEn;
  const productShortDesc = isVi ? product.shortDescVi : product.shortDescEn;
  const productFullDesc = isVi ? product.fullDescVi : product.fullDescEn;
  const ctaText = isVi ? product.ctaTextVi : product.ctaTextEn;

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 pt-32">
      {/* Back Button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-primary-cyan hover:text-accent-blue font-medium mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        {t('products.backToList')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
        {/* Product Image Gallery */}
        <div className="lg:col-span-3">
          {product.images && product.images.length > 0 ? (
            <div className="relative">
              <img
                src={product.images[currentImageIndex]}
                alt={productName}
                className="w-full aspect-video object-cover rounded-xl shadow-lg"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-primary-navy" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-primary-navy" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'w-8 bg-white'
                            : 'w-2 bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center text-white text-9xl font-bold">
              {productName.charAt(0)}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="lg:col-span-2">
          {product.category && (
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-full">
                {product.category}
              </span>
            </div>
          )}

          <h1 className="text-5xl font-heading font-bold text-primary-navy mb-4">
            {productName}
          </h1>

          {productTagline && (
            <p className="text-2xl text-primary-cyan italic mb-6">{productTagline}</p>
          )}

          {productShortDesc && (
            <p className="text-xl text-text-secondary mb-8">{productShortDesc}</p>
          )}

          {/* Pricing */}
          {product.pricing && (
            <div className="mb-8 p-6 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 rounded-xl border-l-4 border-primary-cyan">
              <p className="text-sm text-text-secondary mb-2">{t('products.pricing')}</p>
              <p className="text-4xl font-heading font-bold text-primary-cyan">
                {getPriceDisplay(product.pricing)}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {product.ctaLink ? (
              <a
                href={product.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-lg px-8 py-4 text-center"
              >
                {ctaText || t('products.getStarted')}
              </a>
            ) : (
              <Link to="/contact" className="btn-primary text-lg px-8 py-4 text-center">
                {ctaText || t('products.getStarted')}
              </Link>
            )}
            <Link to="/contact" className="btn-secondary text-lg px-8 py-4 text-center">
              {t('products.contactSales')}
            </Link>
          </div>
        </div>
      </div>

      {/* Full Description */}
      {productFullDesc && (
        <div className="mb-12">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-text-primary">{productFullDesc}</div>
          </div>
        </div>
      )}

      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8">
            {t('products.features')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.features.map((feature, index) => (
              <div key={index} className="glass-card p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  {feature.icon && (
                    <div className="flex-shrink-0 text-4xl">{feature.icon}</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-primary-navy mb-2">
                      {isVi ? feature.titleVi : feature.titleEn}
                    </h3>
                    {(feature.descEn || feature.descVi) && (
                      <p className="text-text-secondary">
                        {isVi ? feature.descVi : feature.descEn}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Values Section */}
      {product.customerValues && product.customerValues.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8">
            {isVi ? 'Giá Trị Mang Lại Cho Khách Hàng' : 'Customer Values'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.customerValues.map((value, index) => (
              <div key={index} className="glass-card p-6 bg-gradient-to-br from-accent-blue/5 to-accent-teal/5 hover:shadow-lg transition-shadow border-l-4 border-primary-cyan">
                <div className="flex items-start gap-4">
                  {value.icon && (
                    <div className="flex-shrink-0 text-4xl">{value.icon}</div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-heading font-bold text-primary-cyan mb-2">
                      {isVi ? value.titleVi : value.titleEn}
                    </h3>
                    {(value.descEn || value.descVi) && (
                      <p className="text-text-secondary">
                        {isVi ? value.descVi : value.descEn}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 p-8 bg-gradient-to-r from-primary-navy to-accent-blue rounded-xl text-white text-center">
        <h3 className="text-3xl font-heading font-bold mb-4">
          {t('products.readyTitle')}
        </h3>
        <p className="text-xl mb-8 text-gray-200">
          {t('products.readyDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-primary-navy hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {t('products.contactUs')}
          </Link>
          <Link
            to="/products"
            className="bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {t('products.viewAll')}
          </Link>
        </div>
      </div>
    </div>
  );
}
