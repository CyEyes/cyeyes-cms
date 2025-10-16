import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Shield, Target, Brain, Users, Package, FileText } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Shield,
      titleKey: 'home.features.defensive.title',
      descKey: 'home.features.defensive.desc',
    },
    {
      icon: Target,
      titleKey: 'home.features.offensive.title',
      descKey: 'home.features.offensive.desc',
    },
    {
      icon: Brain,
      titleKey: 'home.features.intelligence.title',
      descKey: 'home.features.intelligence.desc',
    },
  ];

  const quickLinks = [
    { icon: FileText, label: 'Blog', path: '/blog', color: 'from-blue-500 to-blue-600' },
    { icon: Users, label: 'Team', path: '/team', color: 'from-green-500 to-green-600' },
    { icon: Package, label: 'Products', path: '/products', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-navy via-primary-navy/95 to-accent-blue/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 bg-primary-cyan rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 h-80 w-80 bg-accent-blue rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Logo */}
          <div className="mb-8 inline-block">
            <img
              src="/media/CyEyes2025.1.4.png"
              alt="CyEyes"
              className="h-32 md:h-40 lg:h-48 w-auto mx-auto transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-primary-light-cyan font-medium mb-4">
            {t('home.tagline')}
          </p>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {t('home.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 justify-center"
            >
              {t('home.cta.explore')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20 text-lg px-8 py-4 rounded-lg font-semibold transition-all inline-flex items-center gap-2 justify-center"
            >
              {t('home.cta.contact')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-primary-navy mb-4">
            {t('home.features.title')}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="glass-card p-8 text-center hover:shadow-xl transition-shadow group"
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent-blue to-accent-teal mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-bold text-primary-navy mb-3">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-text-secondary">{t(feature.descKey)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-primary-navy mb-4">
            {t('home.explore.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="glass-card p-8 text-center hover:shadow-xl transition-all group"
              >
                <div
                  className={`inline-flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br ${link.color} mb-6 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary-navy mb-2">
                  {link.label}
                </h3>
                <div className="flex items-center justify-center gap-2 text-primary-cyan font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-navy to-accent-blue py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-heading font-bold text-white mb-6">
            {t('home.cta.ready')}
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            {t('home.cta.message')}
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-navy hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center gap-2 transition-colors"
          >
            {t('home.cta.getStarted')}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
