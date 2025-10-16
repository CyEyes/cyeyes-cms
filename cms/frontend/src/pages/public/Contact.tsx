import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/api';
import { parseValidationErrors, getFieldError, hasFieldError, clearFieldError } from '@utils/validationHelper';
import ValidationError from '@components/ValidationError';

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
  addressEn: string;
  addressVi: string;
  phone: string;
  email: string;
  businessHours: BusinessHours;
  googleMapsEmbedUrl?: string;
  socialLinks: SocialLinks;
  additionalInfoEn: string;
  additionalInfoVi: string;
}

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await api.get('/contact-info');
      setContactInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      // Use fallback data if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setGeneralError('');

    // Basic client-side validation (matches backend schema)
    const errors: Record<string, string> = {};

    // Name validation: 2-100 chars, letters and spaces only (supports Vietnamese)
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must not exceed 100 characters';
    } else if (!/^[a-zA-Z\s\u00C0-\u1EF9]+$/.test(formData.name)) {
      errors.name = 'Name contains invalid characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.length > 255) {
      errors.email = 'Email must not exceed 255 characters';
    }

    // Phone validation: optional, digits/spaces/dashes/parentheses only
    if (formData.phone && formData.phone.trim() !== '') {
      if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        errors.phone = 'Phone contains invalid characters';
      } else if (formData.phone.length > 20) {
        errors.phone = 'Phone must not exceed 20 characters';
      }
    }

    // Subject validation: 5-200 chars
    if (!formData.subject || formData.subject.trim().length < 5) {
      errors.subject = 'Subject must be at least 5 characters';
    } else if (formData.subject.trim().length > 200) {
      errors.subject = 'Subject must not exceed 200 characters';
    }

    // Message validation: 10-5000 chars
    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 5000) {
      errors.message = 'Message must not exceed 5000 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setSending(true);

    try {
      // Send message to backend API
      const response = await api.post('/messages', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response.data.success) {
        toast.success(t('contact.successMessage') || 'Message sent successfully!');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setFieldErrors({});
        setGeneralError('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);

      // Parse validation errors from backend
      const parsedErrors = parseValidationErrors(error);

      if (Object.keys(parsedErrors.fields).length > 0) {
        setFieldErrors(parsedErrors.fields);
        toast.error(parsedErrors.general || 'Please fix the errors in the form');
      } else {
        const errorMsg = parsedErrors.general || 'Failed to send message. Please try again.';
        setGeneralError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setSending(false);
    }
  };

  // Handle field change and clear error for that field
  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(clearFieldError(fieldErrors, field));
    }

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  const contactInfoItems = contactInfo ? [
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone}`,
    },
    {
      icon: MapPin,
      label: 'Address',
      value: i18n.language === 'vi' ? contactInfo.addressVi : contactInfo.addressEn,
      link: null,
    },
  ] : [
    {
      icon: Mail,
      label: 'Email',
      value: 'xinchao@cyeyes.io',
      link: 'mailto:xinchao@cyeyes.io',
    },
    {
      icon: Phone,
      label: 'Website',
      value: 'cyeyes.io',
      link: 'https://cyeyes.io',
    },
    {
      icon: MapPin,
      label: 'Address',
      value: 'Ho Chi Minh City, Vietnam',
      link: null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading font-bold text-primary-navy mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-navy mb-6">
              {t('contact.infoTitle')}
            </h2>
            <div className="space-y-6">
              {contactInfoItems.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-navy mb-1">{info.label}</p>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-text-secondary hover:text-primary-cyan transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-text-secondary">{info.value}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Business Hours */}
          {contactInfo && contactInfo.businessHours && (
            <div className="glass-card p-8">
              <h3 className="text-xl font-heading font-bold text-primary-navy mb-4">
                {t('contact.hoursTitle')}
              </h3>
              <div className="space-y-2 text-text-secondary">
                <p>
                  <span className="font-medium text-primary-navy">{t('contact.weekdays')}:</span>{' '}
                  {contactInfo.businessHours.weekdays}
                </p>
                <p>
                  <span className="font-medium text-primary-navy">{t('contact.saturday')}:</span>{' '}
                  {contactInfo.businessHours.saturday}
                </p>
                <p>
                  <span className="font-medium text-primary-navy">{t('contact.sunday')}:</span>{' '}
                  {contactInfo.businessHours.sunday}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-navy mb-6">
              {t('contact.formTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error Alert */}
              {generalError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{generalError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('contact.name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className={`input-field ${hasFieldError(fieldErrors, 'name') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <ValidationError error={getFieldError(fieldErrors, 'name')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('contact.email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    className={`input-field ${hasFieldError(fieldErrors, 'email') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <ValidationError error={getFieldError(fieldErrors, 'email')} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('contact.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    className={`input-field ${hasFieldError(fieldErrors, 'phone') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <ValidationError error={getFieldError(fieldErrors, 'phone')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    {t('contact.subject')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleFieldChange('subject', e.target.value)}
                    className={`input-field ${hasFieldError(fieldErrors, 'subject') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  <ValidationError error={getFieldError(fieldErrors, 'subject')} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('contact.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  className={`input-field ${hasFieldError(fieldErrors, 'message') ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  rows={6}
                  required
                />
                <ValidationError error={getFieldError(fieldErrors, 'message')} />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full text-lg py-4 inline-flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    {t('contact.sending')}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {t('contact.submit')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {contactInfo && contactInfo.googleMapsEmbedUrl && (
        <div className="mt-16">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-heading font-bold text-primary-navy mb-6 text-center">
              {t('contact.locationTitle')}
            </h2>
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                src={contactInfo.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
