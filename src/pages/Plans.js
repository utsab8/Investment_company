import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Plans.css';

const Plans = () => {
  const { t } = useTranslation();
  const plans = t('plansPage.cards', { returnObjects: true });
  const popularLabel = t('plansPage.popularLabel');
  const labels = t('plansPage.labels', { returnObjects: true });

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('plansPage.headerTitle')}</h1>
          <p>{t('plansPage.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section plans-section">
        <div className="container">
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`plan-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="popular-badge">{popularLabel}</div>}
                <h3 className="text-primary">{plan.name}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>{plan.subtitle}</p>
                <div className="plan-price">{plan.minAmount} <span>{labels.min}</span></div>
                <ul className="plan-features">
                  <li><strong>{plan.returns}</strong> {labels.expectedReturns}</li>
                  <li><strong>{plan.lockIn}</strong> {labels.lockIn}</li>
                  <li>{plan.risk}</li>
                  <li>{plan.support}</li>
                </ul>
                <Link to="/contact" className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'}`}>
                  {t('plansPage.cta')}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Plans;
