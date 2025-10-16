import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary-navy text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4">CyEyes</h3>
            <p className="text-gray-300 text-sm">{t('footer.tagline')}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-gray-300 hover:text-light-cyan transition-colors">{t('nav.blog')}</Link></li>
              <li><Link to="/team" className="text-gray-300 hover:text-light-cyan transition-colors">{t('nav.team')}</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-light-cyan transition-colors">{t('nav.products')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-light-cyan transition-colors">About Us</Link></li>
              <li><Link to="/customers" className="text-gray-300 hover:text-light-cyan transition-colors">{t('nav.customers')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-light-cyan transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Email: <a href="mailto:xinchao@cyeyes.io" className="hover:text-light-cyan transition-colors">xinchao@cyeyes.io</a></li>
              <li>Web: <a href="https://cyeyes.io" target="_blank" rel="noopener noreferrer" className="hover:text-light-cyan transition-colors">cyeyes.io</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
