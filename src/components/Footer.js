import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const services = t('footer.servicesList', { returnObjects: true });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link to="/" className="logo" style={{ display: 'block', marginBottom: '20px' }}>
              {t('brand.main')}
              <span>{t('brand.accent')}</span>
            </Link>
            <p>{t('footer.tagline')}</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <a href="#" className="text-accent" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-accent" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-accent" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t('footer.quickLinksTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/about">{t('footer.quickLinks.about')}</Link></li>
              <li><Link to="/services">{t('footer.quickLinks.services')}</Link></li>
              <li><Link to="/plans">{t('footer.quickLinks.plans')}</Link></li>
              <li><Link to="/blog">{t('footer.quickLinks.blog')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.servicesTitle')}</h4>
            <ul className="footer-links">
              {services.map((service, idx) => (
                <li key={idx}><Link to="/services">{service}</Link></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t('footer.contactTitle')}</h4>
            <ul className="footer-links">
              <li>
                <i className="fas fa-map-marker-alt text-accent" style={{ marginRight: '10px' }}></i>
                {t('footer.address')}
              </li>
              <li>
                <i className="fas fa-phone text-accent" style={{ marginRight: '10px' }}></i>
                {t('footer.phone')}
              </li>
              <li>
                <i className="fas fa-envelope text-accent" style={{ marginRight: '10px' }}></i>
                {t('footer.email')}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            {t('footer.copyright')} | <a href="#">{t('footer.privacy')}</a> | <a href="#">{t('footer.terms')}</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
