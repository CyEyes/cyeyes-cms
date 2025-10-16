import { useState, useEffect } from 'react';
import api from '@services/api';
import toast from 'react-hot-toast';
import { Shield, Smartphone, Key, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  twoFactorEnabled: boolean;
}

export default function TwoFactorAuthPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'status' | 'setup' | 'verify'>('status');

  // Setup states
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesShown, setBackupCodesShown] = useState(false);

  // Disable states
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/admin/profile');
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const response = await api.post('/admin/profile/2fa/setup', {});

      setQrCode(response.data.data.qrCode);
      setSecret(response.data.data.secret);
      setStep('setup');
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error('Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/profile/2fa/enable', {
        secret,
        token: verificationCode,
      });

      setBackupCodes(response.data.backupCodes);
      setBackupCodesShown(true);
      setStep('verify');
      toast.success('2FA enabled successfully!');
    } catch (error: any) {
      console.error('Error enabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);
    try {
      await api.post('/admin/profile/2fa/disable', {
        password,
      });

      toast.success('2FA disabled successfully');
      setPassword('');
      fetchProfile();
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      toast.error(error.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    if (!password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/admin/profile/2fa/regenerate-backup-codes', {
        password,
      });

      setBackupCodes(response.data.backupCodes);
      setBackupCodesShown(true);
      setPassword('');
      toast.success('Backup codes regenerated successfully');
    } catch (error: any) {
      console.error('Error regenerating backup codes:', error);
      toast.error(error.response?.data?.message || 'Failed to regenerate backup codes');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadBackupCodes = () => {
    const text = backupCodes.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cyeyes-2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup codes downloaded');
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-12 w-12 border-4 border-accent-blue border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/profile')}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-primary-navy mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </button>
        <h1 className="text-3xl font-heading font-bold text-primary-navy">
          Two-Factor Authentication
        </h1>
        <p className="text-text-secondary mt-1">
          Secure your account with an additional layer of protection
        </p>
      </div>

      {/* Status View */}
      {step === 'status' && profile && (
        <div className="space-y-6">
          {profile.twoFactorEnabled ? (
            <>
              {/* Enabled Status */}
              <div className="glass-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-primary-navy">
                      2FA is Active
                    </h2>
                    <p className="text-text-secondary">
                      Your account is protected with two-factor authentication
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Backup Codes */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-primary-navy mb-2">
                      Backup Codes
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Regenerate backup codes if you've lost access to them. Each code can only be used once.
                    </p>
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="Enter your password"
                      />
                      <button
                        onClick={handleRegenerateBackupCodes}
                        disabled={loading}
                        className="btn-secondary inline-flex items-center gap-2"
                      >
                        <Key className="h-5 w-5" />
                        Regenerate Backup Codes
                      </button>
                    </div>
                  </div>

                  {/* Disable 2FA */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-primary-navy mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Disable Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      This will remove the extra security layer from your account.
                    </p>
                    <button
                      onClick={handleDisable2FA}
                      disabled={loading || !password}
                      className="btn-danger inline-flex items-center gap-2"
                    >
                      Disable 2FA
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Not Enabled Status */}
              <div className="glass-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-primary-navy">
                      Enable 2FA
                    </h2>
                    <p className="text-text-secondary">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-text-secondary">
                    Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-primary-navy mb-2">How it works:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                      <li>Scan a QR code with Google Authenticator or similar app</li>
                      <li>Enter the 6-digit code from your app</li>
                      <li>Save your backup codes in case you lose access</li>
                      <li>Use your app to generate codes when logging in</li>
                    </ol>
                  </div>

                  <button
                    onClick={handleSetup2FA}
                    disabled={loading}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Smartphone className="h-5 w-5" />
                    Start Setup
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Setup View */}
      {step === 'setup' && (
        <div className="glass-card p-8">
          <h2 className="text-2xl font-heading font-bold text-primary-navy mb-6">
            Scan QR Code
          </h2>

          <div className="space-y-6">
            <p className="text-text-secondary">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>

            {/* QR Code */}
            <div className="flex justify-center">
              {qrCode && (
                <img src={qrCode} alt="QR Code" className="border border-gray-300 rounded-lg p-4" />
              )}
            </div>

            {/* Manual Entry */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-primary-navy mb-2">
                Can't scan? Enter this code manually:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-300 text-sm font-mono">
                  {secret}
                </code>
                <button
                  onClick={() => copyToClipboard(secret)}
                  className="btn-secondary text-sm px-3 py-2"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Verification */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Enter 6-digit code from your app
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="input-field text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('status')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleEnable2FA}
                disabled={loading || verificationCode.length !== 6}
                className="btn-primary flex-1"
              >
                {loading ? 'Verifying...' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success View with Backup Codes */}
      {step === 'verify' && backupCodesShown && (
        <div className="glass-card p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary-navy">
                2FA Enabled Successfully!
              </h2>
              <p className="text-text-secondary">
                Save your backup codes now
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-orange-900 mb-1">
                    Important: Save these backup codes!
                  </p>
                  <p className="text-sm text-orange-700">
                    Each code can only be used once. Store them in a safe place in case you lose access to your authenticator app.
                  </p>
                </div>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="bg-white px-4 py-3 rounded border border-gray-300 text-center font-mono text-sm"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadBackupCodes}
                className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
              >
                <Key className="h-5 w-5" />
                Download Codes
              </button>
              <button
                onClick={() => {
                  setStep('status');
                  fetchProfile();
                }}
                className="btn-primary flex-1"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
