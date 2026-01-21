import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

const Header = () => {
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    // Close menu when route changes
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setCurrentLang(lng);
        localStorage.setItem('language', lng);
    };

    useEffect(() => {
        setCurrentLang(i18n.language);
    }, [i18n.language]);

    return (
        <header className="header" style={{ boxShadow: scrollY > 50 ? 'var(--shadow-lg)' : 'var(--shadow-md)' }}>
            <div className="container navbar">
                <Logo showText={true} forceShowText={true} />

                <div className="hamburger" onClick={toggleMenu}>
                    <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li><Link to="/" className={isActive('/')} onClick={closeMenu}>{t('nav.home')}</Link></li>
                    <li><Link to="/about" className={isActive('/about')} onClick={closeMenu}>{t('nav.about')}</Link></li>
                    <li><Link to="/services" className={isActive('/services')} onClick={closeMenu}>{t('nav.services')}</Link></li>
                    <li><Link to="/process" className={isActive('/process')} onClick={closeMenu}>{t('nav.process')}</Link></li>
                    <li><Link to="/projects" className={isActive('/projects')} onClick={closeMenu}>{t('nav.projects')}</Link></li>
                    <li><Link to="/reports" className={isActive('/reports')} onClick={closeMenu}>{t('nav.reports')}</Link></li>
                    <li><Link to="/faq" className={isActive('/faq')} onClick={closeMenu}>{t('nav.faq')}</Link></li>
                    <li><Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>{t('nav.contact')}</Link></li>
                    <li className="language-switcher">
                        <div className="lang-dropdown">
                            <button 
                                className="lang-btn" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLangOpen(!isLangOpen);
                                }}
                            >
                                <i className="fas fa-globe" style={{ marginRight: '8px' }}></i>
                                {currentLang === 'en' ? t('common.english') : t('common.nepali')}
                                <i className={`fas fa-chevron-${isLangOpen ? 'up' : 'down'}`} style={{ marginLeft: '8px', fontSize: '0.8rem' }}></i>
                            </button>
                            <div className={`lang-options ${isLangOpen ? 'open' : ''}`}>
                                <button 
                                    className={currentLang === 'en' ? 'active' : ''} 
                                    onClick={() => {
                                        changeLanguage('en');
                                        setIsLangOpen(false);
                                    }}
                                >
                                    {t('common.english')}
                                </button>
                                <button 
                                    className={currentLang === 'ne' ? 'active' : ''} 
                                    onClick={() => {
                                        changeLanguage('ne');
                                        setIsLangOpen(false);
                                    }}
                                >
                                    {t('common.nepali')}
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;


