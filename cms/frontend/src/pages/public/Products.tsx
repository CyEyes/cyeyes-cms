import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productService, Product } from '@services/product.service';
import { Package as PackageIcon, ArrowRight, Check, Star } from 'lucide-react';

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.list({ isActive: true, limit: 100 });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];
  const filteredProducts =
    filter === 'all' ? products : products.filter((p) => p.category === filter);
  const featuredProducts = filteredProducts.filter((p) => p.isFeatured);
  const regularProducts = filteredProducts.filter((p) => !p.isFeatured);

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

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-heading font-bold text-primary-navy mb-4">
          {t('products.title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {t('products.subtitle')}
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filter === category
                ? 'bg-gradient-to-r from-accent-blue to-accent-teal text-white shadow-lg'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? t('products.all') : category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">{t('products.loading')}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary text-lg">{t('products.noProducts')}</p>
        </div>
      ) : (
        <>
          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8 text-center">
                {t('products.featured')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="glass-card overflow-hidden hover:shadow-xl transition-all group relative"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    </div>

                    {product.image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={product.image}
                          alt={isVi ? product.nameVi : product.nameEn}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-5xl font-bold">
                        {(isVi ? product.nameVi : product.nameEn).charAt(0)}
                      </div>
                    )}

                    <div className="p-6">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                        {product.category}
                      </span>
                      <h3 className="text-2xl font-heading font-bold text-primary-navy mb-3 group-hover:text-primary-cyan transition-colors">
                        {isVi ? product.nameVi : product.nameEn}
                      </h3>
                      <p className="text-text-secondary mb-4 line-clamp-2">
                        {isVi ? product.descriptionVi : product.descriptionEn}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-2xl font-bold text-primary-cyan">
                          {getPriceDisplay(product.pricing)}
                        </span>
                        <span className="flex items-center gap-2 text-primary-cyan font-medium">
                          {t('products.learnMore')}
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Products */}
          {regularProducts.length > 0 && (
            <div>
              {featuredProducts.length > 0 && (
                <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8 text-center">
                  {t('products.moreProducts')}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="glass-card p-6 hover:shadow-xl transition-shadow group"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={isVi ? product.nameVi : product.nameEn}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-40 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                        {(isVi ? product.nameVi : product.nameEn).charAt(0)}
                      </div>
                    )}

                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-3">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-heading font-bold text-primary-navy mb-2 group-hover:text-primary-cyan transition-colors">
                      {isVi ? product.nameVi : product.nameEn}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {isVi ? product.descriptionVi : product.descriptionEn}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-xl font-bold text-primary-cyan">
                        {getPriceDisplay(product.pricing)}
                      </span>
                      <span className="flex items-center gap-1 text-primary-cyan text-sm font-medium">
                        {t('products.learnMore')}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="mt-20 text-center p-12 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 rounded-xl">
        <h2 className="text-3xl font-heading font-bold text-primary-navy mb-4">
          {t('products.ctaTitle')}
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          {t('products.ctaDesc')}
        </p>
        <a href="/contact" className="btn-primary text-lg px-8 py-4">
          {t('products.ctaBtn')}
        </a>
      </div>
    </div>
  );
}
