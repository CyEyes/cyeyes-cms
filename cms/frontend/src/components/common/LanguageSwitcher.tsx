import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:border-primary-cyan hover:bg-blue-50 transition-all text-sm font-medium"
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.language === 'en' ? 'VI' : 'EN'}</span>
    </button>
  );
}
