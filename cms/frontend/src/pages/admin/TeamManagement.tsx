import { useEffect, useState } from 'react';
import { teamService, TeamMember, CreateTeamRequest } from '@services/team.service';
import { Plus, Edit, Trash2, X, Save, Users as UsersIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleApiError } from '@utils/errorHandler';

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<CreateTeamRequest>({
    nameEn: '',
    nameVi: '',
    positionEn: '',
    positionVi: '',
    department: '',
    photo: '',
    shortBioEn: '',
    shortBioVi: '',
    fullBioEn: '',
    fullBioVi: '',
    email: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: '',
    },
    expertise: [],
    isActive: true,
    displayOrder: 0,
  });
  const [expertiseInput, setExpertiseInput] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await teamService.listAdmin({ limit: 100 });
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: TeamMember) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        nameEn: member.nameEn,
        nameVi: member.nameVi,
        positionEn: member.positionEn || '',
        positionVi: member.positionVi || '',
        department: member.department || '',
        photo: member.photo || '',
        shortBioEn: member.shortBioEn || '',
        shortBioVi: member.shortBioVi || '',
        fullBioEn: member.fullBioEn || '',
        fullBioVi: member.fullBioVi || '',
        email: member.email || '',
        phone: member.phone || '',
        socialLinks: member.socialLinks || { linkedin: '', twitter: '', github: '' },
        expertise: member.expertise || [],
        isActive: member.isActive,
        displayOrder: member.displayOrder,
      });
      setExpertiseInput(member.expertise?.join(', ') || '');
    } else {
      setEditingMember(null);
      setFormData({
        nameEn: '',
        nameVi: '',
        positionEn: '',
        positionVi: '',
        department: '',
        photo: '',
        shortBioEn: '',
        shortBioVi: '',
        fullBioEn: '',
        fullBioVi: '',
        email: '',
        phone: '',
        socialLinks: {
          linkedin: '',
          twitter: '',
          github: '',
        },
        expertise: [],
        isActive: true,
        displayOrder: members.length,
      });
      setExpertiseInput('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Parse expertise from comma-separated string
      const expertise = expertiseInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const submitData = {
        ...formData,
        expertise: expertise.length > 0 ? expertise : undefined,
      };

      if (editingMember) {
        await teamService.update(editingMember.id, submitData);
        toast.success('Team member updated successfully');
      } else {
        await teamService.create(submitData);
        toast.success('Team member created successfully');
      }
      handleCloseModal();
      fetchMembers();
    } catch (error: any) {
      handleApiError(error, 'Failed to save team member');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await teamService.delete(id);
      toast.success('Team member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-primary-navy">Team Members</h2>
          <p className="text-text-secondary mt-1">Manage your team profiles</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Team Member
        </button>
      </div>

      {/* Team Grid */}
      {loading ? (
        <div className="glass-card p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto"></div>
          <p className="text-text-secondary mt-4">Loading team members...</p>
        </div>
      ) : members.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-text-secondary">No team members yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.nameEn}
                      className="h-20 w-20 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center text-white text-2xl font-bold mb-3">
                      {member.nameEn.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(member)}
                    className="text-gray-600 hover:text-primary-cyan"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id, member.nameEn)}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-heading font-bold text-primary-navy mb-1">
                {member.nameEn}
              </h3>
              <p className="text-sm text-primary-cyan font-medium mb-2">
                {member.positionEn || member.positionVi || member.position || 'No position'}
              </p>
              {member.department && (
                <p className="text-xs text-text-secondary mb-2">📍 {member.department}</p>
              )}
              <p className="text-sm text-text-secondary line-clamp-3 mb-3">
                {member.shortBioEn || member.fullBioEn || member.bioEn || 'No bio'}
              </p>
              {member.expertise && member.expertise.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {member.expertise.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-primary-light-cyan text-primary-navy px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.expertise.length > 3 && (
                    <span className="text-xs text-text-secondary">
                      +{member.expertise.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs text-text-secondary">Order: {member.displayOrder}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-heading font-bold text-primary-navy">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-primary-navy">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="input-field"
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tên (Tiếng Việt) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nameVi}
                      onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                      className="input-field"
                      required
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Position (English)
                    </label>
                    <input
                      type="text"
                      value={formData.positionEn}
                      onChange={(e) => setFormData({ ...formData, positionEn: e.target.value })}
                      className="input-field"
                      placeholder="Senior Security Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Chức vụ (Tiếng Việt)
                    </label>
                    <input
                      type="text"
                      value={formData.positionVi}
                      onChange={(e) => setFormData({ ...formData, positionVi: e.target.value })}
                      className="input-field"
                      placeholder="Kỹ sư bảo mật cao cấp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="input-field"
                      placeholder="Security, Engineering, Management"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Photo URL
                    </label>
                    <input
                      type="url"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-primary-navy">Biography</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Short Bio (English)
                    </label>
                    <textarea
                      value={formData.shortBioEn}
                      onChange={(e) => setFormData({ ...formData, shortBioEn: e.target.value })}
                      className="input-field"
                      rows={3}
                      placeholder="Brief introduction (max 500 chars)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tiểu sử ngắn (Tiếng Việt)
                    </label>
                    <textarea
                      value={formData.shortBioVi}
                      onChange={(e) => setFormData({ ...formData, shortBioVi: e.target.value })}
                      className="input-field"
                      rows={3}
                      placeholder="Giới thiệu ngắn (tối đa 500 ký tự)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Bio (English)
                    </label>
                    <textarea
                      value={formData.fullBioEn}
                      onChange={(e) => setFormData({ ...formData, fullBioEn: e.target.value })}
                      className="input-field"
                      rows={4}
                      placeholder="Detailed biography"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Tiểu sử đầy đủ (Tiếng Việt)
                    </label>
                    <textarea
                      value={formData.fullBioVi}
                      onChange={(e) => setFormData({ ...formData, fullBioVi: e.target.value })}
                      className="input-field"
                      rows={4}
                      placeholder="Tiểu sử chi tiết"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-primary-navy">Contact & Social</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="+84 123 456 789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks?.linkedin || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks?.twitter || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.socialLinks?.github || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          socialLinks: { ...formData.socialLinks, github: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Expertise & Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-primary-navy">Expertise & Settings</h4>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Expertise (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    className="input-field"
                    placeholder="Penetration Testing, Security Auditing, Network Security"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Enter skills separated by commas
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, displayOrder: parseInt(e.target.value) })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-primary-cyan focus:ring-primary-cyan rounded"
                      />
                      <span className="text-sm font-medium text-text-primary">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={handleCloseModal} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary inline-flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  {editingMember ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
