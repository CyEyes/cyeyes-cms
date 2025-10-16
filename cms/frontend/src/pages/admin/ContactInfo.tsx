import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@services/api';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, Globe, Save } from 'lucide-react';

interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  holidays: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
}

interface ContactInfoData {
  id: string;
  addressEn: string;
  addressVi: string;
  phone: string;
  email: string;
  fax?: string;
  businessHours: BusinessHours;
  latitude: string;
  longitude: string;
  googleMapsEmbedUrl?: string;
  socialLinks: SocialLinks;
  additionalInfoEn: string;
  additionalInfoVi: string;
  isActive: boolean;
}

/**
 * Extract URL from Google Maps embed code
 * Handles both direct URLs and full iframe embed code
 */
const extractGoogleMapsUrl = (input: string): string => {
  if (!input) return '';

  // Remove whitespace
  const cleaned = input.trim();

  // If it's already a URL, return it
  if (cleaned.startsWith('http')) {
    return cleaned;
  }

  // Extract URL from iframe embed code
  const srcMatch = cleaned.match(/src=["']([^"']+)["']/);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }

  return cleaned;
};

export default function ContactInfoPage() {
  const { t, i18n } = useTranslation();
  const [contact, setContact] = useState<ContactInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await api.get('/contact-info/admin');

      setContact(response.data.data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast.error('Failed to load contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contact) return;

    setSaving(true);
    try {
      // Extract clean URL from embed code if needed
      const cleanedContact = {
        ...contact,
        googleMapsEmbedUrl: contact.googleMapsEmbedUrl
          ? extractGoogleMapsUrl(contact.googleMapsEmbedUrl)
          : undefined
      };

      await api.post('/contact-info/admin/update', cleanedContact);

      toast.success('Contact information updated successfully');

      // Update local state with cleaned URL
      setContact(cleanedContact);
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact information');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-accent-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center text-text-secondary">
        No contact information found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-navy">
            Contact Information Management
          </h1>
          <p className="text-text-secondary mt-1">
            Manage your company's contact details and business hours
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-primary-navy">
              Contact Details
            </h2>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="input-field"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="input-field"
                required
              />
            </div>

            {/* Fax */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Fax
              </label>
              <input
                type="tel"
                value={contact.fax || ''}
                onChange={(e) => setContact({ ...contact, fax: e.target.value })}
                className="input-field"
              />
            </div>

            {/* Address English */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Address (English) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={contact.addressEn}
                onChange={(e) => setContact({ ...contact, addressEn: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>

            {/* Address Vietnamese */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Address (Vietnamese) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={contact.addressVi}
                onChange={(e) => setContact({ ...contact, addressVi: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-primary-navy">
              Business Hours
            </h2>
          </div>

          <div className="space-y-4">
            {/* Weekdays */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Weekdays (Mon-Fri)
              </label>
              <input
                type="text"
                value={contact.businessHours.weekdays}
                onChange={(e) => setContact({
                  ...contact,
                  businessHours: { ...contact.businessHours, weekdays: e.target.value }
                })}
                className="input-field"
                placeholder="9:00 AM - 6:00 PM"
              />
            </div>

            {/* Saturday */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Saturday
              </label>
              <input
                type="text"
                value={contact.businessHours.saturday}
                onChange={(e) => setContact({
                  ...contact,
                  businessHours: { ...contact.businessHours, saturday: e.target.value }
                })}
                className="input-field"
                placeholder="9:00 AM - 12:00 PM"
              />
            </div>

            {/* Sunday */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sunday
              </label>
              <input
                type="text"
                value={contact.businessHours.sunday}
                onChange={(e) => setContact({
                  ...contact,
                  businessHours: { ...contact.businessHours, sunday: e.target.value }
                })}
                className="input-field"
                placeholder="Closed"
              />
            </div>

            {/* Holidays */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Holidays
              </label>
              <input
                type="text"
                value={contact.businessHours.holidays}
                onChange={(e) => setContact({
                  ...contact,
                  businessHours: { ...contact.businessHours, holidays: e.target.value }
                })}
                className="input-field"
                placeholder="Closed"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-primary-navy">
              Location
            </h2>
          </div>

          <div className="space-y-4">
            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Latitude
              </label>
              <input
                type="text"
                value={contact.latitude}
                onChange={(e) => setContact({ ...contact, latitude: e.target.value })}
                className="input-field"
                placeholder="10.7769"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Longitude
              </label>
              <input
                type="text"
                value={contact.longitude}
                onChange={(e) => setContact({ ...contact, longitude: e.target.value })}
                className="input-field"
                placeholder="106.7009"
              />
            </div>

            {/* Google Maps Embed URL */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Google Maps Embed URL
              </label>
              <textarea
                value={contact.googleMapsEmbedUrl || ''}
                onChange={(e) => setContact({ ...contact, googleMapsEmbedUrl: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Paste either the URL or full embed code from Google Maps"
              />
              <p className="text-xs text-text-secondary mt-1">
                Get embed code from Google Maps → Share → Embed a map. You can paste either the full iframe code or just the URL.
              </p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold text-primary-navy">
              Social Media
            </h2>
          </div>

          <div className="space-y-4">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Facebook
              </label>
              <input
                type="url"
                value={contact.socialLinks.facebook || ''}
                onChange={(e) => setContact({
                  ...contact,
                  socialLinks: { ...contact.socialLinks, facebook: e.target.value }
                })}
                className="input-field"
                placeholder="https://facebook.com/cyeyes"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={contact.socialLinks.twitter || ''}
                onChange={(e) => setContact({
                  ...contact,
                  socialLinks: { ...contact.socialLinks, twitter: e.target.value }
                })}
                className="input-field"
                placeholder="https://twitter.com/cyeyes"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={contact.socialLinks.linkedin || ''}
                onChange={(e) => setContact({
                  ...contact,
                  socialLinks: { ...contact.socialLinks, linkedin: e.target.value }
                })}
                className="input-field"
                placeholder="https://linkedin.com/company/cyeyes"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={contact.socialLinks.github || ''}
                onChange={(e) => setContact({
                  ...contact,
                  socialLinks: { ...contact.socialLinks, github: e.target.value }
                })}
                className="input-field"
                placeholder="https://github.com/cyeyes"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={contact.socialLinks.instagram || ''}
                onChange={(e) => setContact({
                  ...contact,
                  socialLinks: { ...contact.socialLinks, instagram: e.target.value }
                })}
                className="input-field"
                placeholder="https://instagram.com/cyeyes"
              />
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-heading font-bold text-primary-navy mb-6">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Additional Info (English)
              </label>
              <textarea
                value={contact.additionalInfoEn}
                onChange={(e) => setContact({ ...contact, additionalInfoEn: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Feel free to reach out..."
              />
            </div>

            {/* Vietnamese */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Additional Info (Vietnamese)
              </label>
              <textarea
                value={contact.additionalInfoVi}
                onChange={(e) => setContact({ ...contact, additionalInfoVi: e.target.value })}
                className="input-field"
                rows={4}
                placeholder="Hãy liên hệ với chúng tôi..."
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={contact.isActive}
              onChange={(e) => setContact({ ...contact, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-accent-blue focus:ring-accent-blue"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-text-primary">
              Show contact information on public page
            </label>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary inline-flex items-center gap-2 px-8"
        >
          {saving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
