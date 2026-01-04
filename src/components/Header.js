import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || '').split('-')[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar">
        <Link to="/" className="logo">
          {t('brand.main')}
          <span>{t('brand.accent')}</span>
        </Link>

        <div className="hamburger" onClick={toggleMenu}>
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/') ? 'active' : ''}>{t('nav.home')}</Link></li>
          <li><Link to="/about" className={isActive('/about') ? 'active' : ''}>{t('nav.about')}</Link></li>
          <li><Link to="/services" className={isActive('/services') ? 'active' : ''}>{t('nav.services')}</Link></li>
          <li><Link to="/process" className={isActive('/process') ? 'active' : ''}>{t('nav.process')}</Link></li>
          <li><Link to="/plans" className={isActive('/plans') ? 'active' : ''}>{t('nav.plans')}</Link></li>
          <li><Link to="/reports" className={isActive('/reports') ? 'active' : ''}>{t('nav.reports')}</Link></li>
          <li><Link to="/blog" className={isActive('/blog') ? 'active' : ''}>{t('nav.blog')}</Link></li>
          <li><Link to="/faq" className={isActive('/faq') ? 'active' : ''}>{t('nav.faq')}</Link></li>
          <li><Link to="/contact" className={isActive('/contact') ? 'active' : ''}>{t('nav.contact')}</Link></li>
          <li className="language-toggle">
            <button
              type="button"
              className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`lang-btn ${currentLang === 'ne' ? 'active' : ''}`}
              onClick={() => changeLanguage('ne')}
            >
              ने
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
