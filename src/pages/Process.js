import React from 'react';
import { useTranslation } from 'react-i18next';
import './Process.css';

const Process = () => {
  const { t } = useTranslation();
  const steps = t('process.steps', { returnObjects: true });
  const riskFeatures = t('process.riskFeatures', { returnObjects: true });

  const getStepColor = (index) => (index === 0 || index === steps.length - 1 ? 'var(--accent-color)' : 'var(--primary-color)');

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('process.headerTitle')}</h1>
          <p>{t('process.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="process-container">
            <div className="process-line"></div>
            {steps.map((step, index) => (
              <div key={index} className="process-step">
                <div 
                  className="process-number"
                  style={{ backgroundColor: getStepColor(index) }}
                >
                  {step.number}
                </div>
                <div className="process-content">
                  <h3 className="text-primary">{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section risk-section">
        <div className="container">
          <h2 className="text-center" style={{ marginBottom: '50px' }}>{t('process.riskTitle')}</h2>
          <div className="risk-grid">
            {riskFeatures.map((feature, index) => (
              <div key={index} className="risk-card">
                <h4 className="text-accent">{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
