import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import axios from 'axios';
import LogoUpload from '../../components/admin/LogoUpload';
import FaviconUpload from '../../components/admin/FaviconUpload';

interface SiteConfigData {
  id: string;
  siteName: string;
  logoUrl: string;
  logoAdminUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/site-config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(response.data);
    } catch (error) {
      console.error('Failed to load config', error);
      alert('Failed to load site configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (type: 'main' | 'admin') => (url: string) => {
    if (config) {
      setConfig({
        ...config,
        [type === 'main' ? 'logoUrl' : 'logoAdminUrl']: url,
      });
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/site-config/update', {
        siteName: config.siteName,
        primaryColor: config.primaryColor,
        secondaryColor: config.secondaryColor,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!config) {
    return <div className="p-8 text-center text-red-600">Site configuration not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-primary-cyan" />
        <h1 className="text-3xl font-bold">Site Configuration</h1>
      </div>

      <div className="space-y-8">
        {/* Logos */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Logos</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LogoUpload
              type="main"
              currentUrl={config.logoUrl}
              onUploadSuccess={handleLogoUpload('main')}
            />

            <LogoUpload
              type="admin"
              currentUrl={config.logoAdminUrl}
              onUploadSuccess={handleLogoUpload('admin')}
            />
          </div>
        </div>

        {/* Favicon */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Favicon</h2>
          <FaviconUpload
            currentUrl={config.faviconUrl}
            onUploadSuccess={(url) => setConfig({ ...config, faviconUrl: url })}
          />
        </div>

        {/* Branding */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Branding</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter site name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="h-10 w-20 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="h-10 w-20 border rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
