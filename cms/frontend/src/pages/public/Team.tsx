import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { teamService, TeamMember } from '@services/team.service';
import { Mail, Phone, Linkedin, Twitter, Github, Users as UsersIcon } from 'lucide-react';

export default function TeamPage() {
  const { t, i18n } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const isVi = i18n.language === 'vi';

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await teamService.list({ isActive: true, limit: 100 });
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-12">
        {/* Header with modern design */}
        <div className="text-center mb-20">
          <h1 className="text-6xl font-heading font-black text-primary-navy mb-6 leading-tight">
            {t('team.title')}
          </h1>
          <p className="text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('team.subtitle')}
          </p>
        </div>

        {/* Team Grid */}
        {loading ? (
          <div className="text-center py-32">
            <div className="animate-spin h-16 w-16 border-4 border-primary-cyan border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-text-secondary text-lg">{t('team.loading')}</p>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-32">
            <UsersIcon className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <p className="text-text-secondary text-xl">{t('team.noMembers')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {members.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Decorative gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light-cyan/5 to-accent-teal/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10">
                  {/* Avatar with 70% height - larger for better visibility */}
                  <div className="w-full flex justify-center -mb-20">
                    {(member.photo || member.avatar) ? (
                      <img
                        src={member.photo || member.avatar || ''}
                        alt={isVi ? member.nameVi : member.nameEn}
                        className="w-full aspect-[3/4] object-cover border-4 border-primary-light-cyan shadow-2xl group-hover:scale-105 transition-transform rounded-t-3xl"
                      />
                    ) : (
                      <div className="w-full aspect-[3/4] bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center text-white text-8xl font-bold shadow-2xl group-hover:scale-105 transition-transform rounded-t-3xl">
                        {(isVi ? member.nameVi : member.nameEn).charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Content section with padding - adjusted for better spacing */}
                  <div className="pt-16 pb-10 px-10 bg-white rounded-b-3xl relative">
                    {/* Name & Position */}
                    <h3 className="text-2xl font-heading font-bold text-primary-navy mb-2 text-center">
                      {isVi ? member.nameVi : member.nameEn}
                    </h3>
                    <p className="text-primary-cyan font-bold text-lg mb-2 text-center">
                      {isVi
                        ? member.positionVi || member.positionEn || member.position
                        : member.positionEn || member.positionVi || member.position
                      }
                    </p>
                    {member.department && (
                      <div className="flex items-center justify-center gap-2 mb-5">
                        <span className="inline-flex items-center px-4 py-1.5 bg-gray-100 text-text-secondary rounded-full text-sm font-medium">
                          📍 {member.department}
                        </span>
                      </div>
                    )}

                    {/* Bio */}
                    <p className="text-text-secondary text-base leading-relaxed mb-6 text-center min-h-[4rem]">
                      {isVi
                        ? member.shortBioVi || member.fullBioVi || member.bioVi || member.shortBioEn || member.fullBioEn || member.bioEn
                        : member.shortBioEn || member.fullBioEn || member.bioEn || member.shortBioVi || member.fullBioVi || member.bioVi
                      }
                    </p>

                    {/* Expertise Tags */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {member.expertise.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-sm bg-gradient-to-r from-primary-cyan to-accent-teal text-white px-4 py-1.5 rounded-full font-semibold shadow-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {member.expertise.length > 4 && (
                          <span className="text-sm text-text-secondary font-medium">
                            +{member.expertise.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Social Links with improved design */}
                    <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-200">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-cyan hover:to-accent-teal hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
                          title="Email"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-cyan hover:to-accent-teal hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
                          title="Phone"
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                      )}
                      {(member.socialLinks?.linkedin || member.linkedin) && (
                        <a
                          href={member.socialLinks?.linkedin || member.linkedin || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-cyan hover:to-accent-teal hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {(member.socialLinks?.twitter || member.twitter) && (
                        <a
                          href={member.socialLinks?.twitter || member.twitter || ''}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-cyan hover:to-accent-teal hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
                          title="Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.socialLinks?.github && (
                        <a
                          href={member.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-primary-cyan hover:to-accent-teal hover:text-white flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:scale-110"
                          title="GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join CTA with modern design */}
        <div className="mt-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-cyan/10 via-accent-teal/10 to-primary-light-cyan/10 rounded-3xl"></div>
          <div className="relative text-center p-16 rounded-3xl border-2 border-primary-light-cyan/30">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-lg mb-6">
              <UsersIcon className="h-10 w-10 text-primary-cyan" />
            </div>
            <h2 className="text-4xl font-heading font-black text-primary-navy mb-6">
              {t('team.joinTitle')}
            </h2>
            <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('team.joinDesc')}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-cyan to-accent-teal text-white font-bold text-lg px-10 py-5 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>{t('team.joinBtn')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
