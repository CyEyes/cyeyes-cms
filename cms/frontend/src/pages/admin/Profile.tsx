import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '@services/api';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Camera, Save, Key } from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: string;
  twoFactorEnabled: boolean;
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/admin/profile');

      const data = response.data.data;
      setProfile(data);
      setFullName(data.fullName);
      setEmail(data.email);
      if (data.avatar) {
        setAvatarPreview(data.avatar);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      // Update basic info
      await api.post('/admin/profile/update', {
        fullName,
        email,
      });

      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await api.post('/admin/profile/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setAvatarPreview(avatarResponse.data.avatarUrl);
      }

      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      await api.post('/admin/profile/change-password', {
        currentPassword,
        newPassword,
      });

      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
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

  if (!profile) {
    return (
      <div className="text-center text-text-secondary">
        Profile not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-primary-navy">
          My Profile
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your account settings and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Basic Info */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary-navy">
                Profile Picture
              </h2>
            </div>

            <div className="space-y-4">
              {/* Avatar Preview */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-accent-blue text-white flex items-center justify-center cursor-pointer hover:bg-accent-blue/90 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-text-secondary">
                  PNG or JPEG, max 2MB
                </p>
              </div>

              {/* User Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-text-secondary">Role</p>
                    <p className="text-sm font-medium text-primary-navy capitalize">
                      {profile.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">2FA Status</p>
                    <p className="text-sm font-medium">
                      {profile.twoFactorEnabled ? (
                        <span className="text-green-600">✓ Enabled</span>
                      ) : (
                        <span className="text-orange-600">Not Enabled</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-heading font-bold text-primary-navy">
                  Basic Information
                </h2>
              </div>
              <button
                onClick={handleUpdateProfile}
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

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary-navy">
                Change Password
              </h2>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  autoComplete="current-password"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  autoComplete="new-password"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Minimum 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Key className="h-5 w-5" />
                Change Password
              </button>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-primary-navy">
                Two-Factor Authentication
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-text-secondary">
                Add an extra layer of security to your account by enabling two-factor authentication using Google Authenticator or similar TOTP apps.
              </p>

              {profile.twoFactorEnabled ? (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">2FA is Active</p>
                      <p className="text-sm text-green-700">Your account is protected</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = '/admin/profile/2fa'}
                    className="text-sm text-accent-blue hover:text-accent-blue/80 font-medium"
                  >
                    Manage →
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-orange-900">2FA Not Enabled</p>
                      <p className="text-sm text-orange-700">Enable for better security</p>
                    </div>
                  </div>
                  <button
                    onClick={() => window.location.href = '/admin/profile/2fa'}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Enable 2FA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
