import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@store/authStore';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2, Shield } from 'lucide-react';
import { handleApiError } from '@utils/errorHandler';
import api from '@services/api';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      // Check if 2FA is required
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setTempToken(response.data.tempToken);
        toast.success('Please enter your 2FA code');
      } else {
        // Normal login without 2FA
        const { user, accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        useAuthStore.setState({ user, isAuthenticated: true });
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      handleApiError(error, 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!twoFactorCode) {
      toast.error('Please enter verification code');
      return;
    }

    setIsLoading(true);

    try {
      // Use tempToken for authentication
      const response = await api.post(
        '/auth/verify-2fa-login',
        {
          token: twoFactorCode,
          useBackupCode,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      if (response.data.success) {
        const { user, accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        useAuthStore.setState({ user, isAuthenticated: true });
        toast.success('Login successful with 2FA!');
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      handleApiError(error, '2FA verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-cyan/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-accent-blue to-accent-teal rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-primary-navy">
            CyEyes CMS
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            {t('auth.login')} to your admin dashboard
          </p>
        </div>

        {/* Login Form or 2FA Form */}
        <div className="glass-card p-8">
          {!requires2FA ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@cyeyes.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  {t('auth.login')}
                </>
              )}
            </button>
          </form>
          ) : (
            // 2FA Verification Form
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-accent-blue to-accent-teal rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary-navy">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-text-secondary mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              {/* 2FA Code Field */}
              <div>
                <label htmlFor="2fa-code" className="block text-sm font-medium text-text-primary mb-2">
                  {useBackupCode ? 'Backup Code' : 'Verification Code'}
                </label>
                <input
                  id="2fa-code"
                  name="2fa-code"
                  type="text"
                  autoComplete="off"
                  required
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="input-field text-center text-2xl tracking-widest"
                  placeholder={useBackupCode ? 'XXXX-XXXX-XXXX' : '000000'}
                  maxLength={useBackupCode ? 14 : 6}
                  disabled={isLoading}
                />
              </div>

              {/* Toggle Backup Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setUseBackupCode(!useBackupCode);
                    setTwoFactorCode('');
                  }}
                  className="text-sm text-accent-blue hover:text-primary-cyan transition-colors"
                >
                  {useBackupCode ? 'Use authenticator code' : 'Use backup code instead'}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Verify & Login
                  </>
                )}
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorCode('');
                  setTempToken('');
                }}
                disabled={isLoading}
                className="w-full text-sm text-text-secondary hover:text-primary-navy transition-colors"
              >
                ← Back to login
              </button>
            </form>
          )}

          {/* Helper Text (only show on login form) */}
          {!requires2FA && (
            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Default: admin@cyeyes.com / ChangeThisPassword123!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-secondary">
          © 2025 CyEyes. All rights reserved.
        </p>
      </div>
    </div>
  );
}
