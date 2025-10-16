import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { customerService, Customer } from '@services/customer.service';
import { Briefcase, ExternalLink, Quote } from 'lucide-react';

export default function CustomersPage() {
  const { t, i18n } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerService.list({ limit: 100 });
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredCustomers = customers.filter((c) => c.isFeatured);
  const regularCustomers = customers.filter((c) => !c.isFeatured);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-bold text-primary-navy mb-4">
          {t('customers.title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {t('customers.subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">{t('customers.loading')}</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary text-lg">{t('customers.noCustomers')}</p>
        </div>
      ) : (
        <>
          {/* Featured Testimonials */}
          {featuredCustomers.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8 text-center">
                {t('customers.featuredTitle')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredCustomers.map((customer) => {
                  const testimonial = isVi ? customer.testimonialVi : customer.testimonialEn;
                  if (!testimonial) return null;

                  return (
                    <div
                      key={customer.id}
                      className="glass-card p-8 hover:shadow-xl transition-shadow"
                    >
                      <Quote className="h-10 w-10 text-primary-cyan mb-4" />
                      <p className="text-lg text-text-primary italic mb-6">"{testimonial}"</p>

                      <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                        {customer.logo ? (
                          <img
                            src={customer.logo}
                            alt={isVi ? customer.nameVi : customer.nameEn}
                            className="h-16 w-auto object-contain"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                            {(isVi ? customer.nameVi : customer.nameEn).charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-primary-navy">
                            {isVi ? customer.nameVi : customer.nameEn}
                          </p>
                          <p className="text-sm text-text-secondary">{customer.industry}</p>
                        </div>
                        {customer.website && (
                          <a
                            href={customer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-primary-cyan hover:text-accent-blue"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Customers Logo Grid */}
          {regularCustomers.length > 0 && (
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary-navy mb-8 text-center">
                {t('customers.partnersTitle')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {regularCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="glass-card hover:shadow-xl transition-shadow group overflow-hidden flex flex-col"
                  >
                    {/* Logo section - larger for better visibility */}
                    <div className="flex-1 flex items-center justify-center p-6 min-h-[200px]">
                      {customer.logo ? (
                        <img
                          src={customer.logo}
                          alt={isVi ? customer.nameVi : customer.nameEn}
                          className="w-full h-full max-h-[180px] object-contain grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                          {(isVi ? customer.nameVi : customer.nameEn).charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Info section - compact at bottom */}
                    <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-gray-100">
                      <p className="text-center font-medium text-text-primary text-sm truncate">
                        {isVi ? customer.nameVi : customer.nameEn}
                      </p>
                      <p className="text-center text-xs text-text-secondary mt-1 truncate">
                        {customer.industry}
                      </p>
                      {customer.website && (
                        <a
                          href={customer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-primary-cyan hover:text-accent-blue text-xs flex items-center justify-center gap-1"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* CTA */}
      <div className="mt-20 text-center p-12 bg-gradient-to-r from-accent-blue/10 to-accent-teal/10 rounded-xl">
        <h2 className="text-3xl font-heading font-bold text-primary-navy mb-4">
          {t('customers.ctaTitle')}
        </h2>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
          {t('customers.ctaDesc')}
        </p>
        <a href="/contact" className="btn-primary text-lg px-8 py-4">
          {t('customers.ctaBtn')}
        </a>
      </div>
    </div>
  );
}
