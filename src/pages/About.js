import React from 'react';
import { useTranslation } from 'react-i18next';
import './PageTemplate.css';

const About = () => {
  const { t } = useTranslation();
  const timeline = t('about.timeline', { returnObjects: true });
  const team = t('about.team', { returnObjects: true });
  const complianceBadges = t('about.complianceBadges', { returnObjects: true });
  const complianceIcons = ['fa-certificate', 'fa-balance-scale', 'fa-lock'];

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('about.headerTitle')}</h1>
          <p>{t('about.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-column-grid">
            <div>
              <h4 className="text-accent">{t('about.storyBadge')}</h4>
              <h2>{t('about.storyTitle')}</h2>
              <p style={{ marginBottom: '20px' }}>
                {t('about.storyIntro')}
              </p>
              <p>{t('about.storyBody')}</p>
            </div>
            <div className="mission-vision-grid">
              <div className="mission-card">
                <h3><i className="fas fa-bullseye text-accent"></i> {t('about.missionTitle')}</h3>
                <p>{t('about.missionText')}</p>
              </div>
              <div className="vision-card">
                <h3><i className="fas fa-eye text-primary"></i> {t('about.visionTitle')}</h3>
                <p>{t('about.visionText')}</p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '80px', marginBottom: '80px' }}>
            <h3 className="text-center text-primary" style={{ marginBottom: '40px' }}>{t('about.journeyTitle')}</h3>
            <div className="timeline">
              {timeline.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="compliance-card">
            <div className="compliance-content">
              <h3>{t('about.complianceTitle')}</h3>
              <p>{t('about.complianceText')}</p>
              <div className="compliance-badges">
                {complianceBadges.map((badge, idx) => (
                  <div key={idx}>
                    <i className={`fas ${complianceIcons[idx] || 'fa-certificate'} text-accent`}></i>
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '80px' }}>
            <h4 className="text-accent">{t('about.leadershipBadge')}</h4>
            <h2>{t('about.leadershipTitle')}</h2>
            <p style={{ marginBottom: '50px' }}>{t('about.leadershipSubtitle')}</p>

            <div className="team-grid">
              {team.map((member, idx) => (
                <div key={idx} className="team-card">
                  <img
                    src={
                      idx === 0
                        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                        : idx === 1
                        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                        : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
                    }
                    alt={member.name}
                    loading="lazy"
                  />
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="text-accent">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
