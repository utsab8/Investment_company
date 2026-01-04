import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Services.css';

const Services = () => {
  const { t } = useTranslation();
  const services = t('services.items', { returnObjects: true });

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('services.headerTitle')}</h1>
          <p>{t('services.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div 
                  className="service-image"
                  style={{ backgroundImage: `url('${service.image}')` }}
                ></div>
                <div className="service-content">
                  <h3 className="text-primary">
                    <i className={`fas ${service.icon} text-accent`} style={{ marginRight: '10px' }}></i>
                    {service.title}
                  </h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-outline">{t('services.cta')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
