import React from 'react';
import { useTranslation } from 'react-i18next';
import './Reports.css';

const Reports = () => {
  const { t } = useTranslation();
  const resources = t('reports.resources', { returnObjects: true });
  const statsList = t('reports.statsList', { returnObjects: true });
  const chartLabels = t('reports.chartLabels', { returnObjects: true });

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('reports.headerTitle')}</h1>
          <p>{t('reports.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '50px' }}>{t('reports.performanceTitle')}</h2>

          <div className="performance-grid">
            <div className="chart-container">
              <h3 style={{ marginBottom: '20px' }}>{t('reports.chartTitle')}</h3>
              <div className="chart-bars">
                <div className="chart-bar" style={{ height: '40%', background: '#ccc' }}>
                  <span className="chart-value">6%</span>
                  <span className="chart-label">{chartLabels.inflation}</span>
                </div>
                <div className="chart-bar" style={{ height: '70%', background: 'var(--primary-light)' }}>
                  <span className="chart-value">12%</span>
                  <span className="chart-label">{chartLabels.market}</span>
                </div>
                <div className="chart-bar" style={{ height: '95%', background: 'var(--accent-color)' }}>
                  <span className="chart-value">18%</span>
                  <span className="chart-label">{chartLabels.investcorp}</span>
                </div>
              </div>
            </div>

            <div className="performance-stats">
              <h3 className="text-primary">{t('reports.statsTitle')}</h3>
              <p style={{ marginBottom: '20px' }}>
                {t('reports.statsText')}
              </p>
              <ul className="stats-list">
                {statsList.map((stat, idx) => {
                  const [highlight, ...rest] = stat.split(' ');
                  return (
                    <li key={idx}>
                      <strong>{highlight}</strong> {rest.join(' ')}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section resources-section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '40px' }}>{t('reports.resourcesTitle')}</h2>
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <a key={index} href="#" className="resource-card">
                <i className={`fas ${resource.icon} text-accent`}></i>
                <div>
                  <h4>{resource.title}</h4>
                  <span>{resource.size}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
