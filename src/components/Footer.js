import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { getWebsiteSettings } from '../services/publicApi';

const Footer = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({});
    
    useEffect(() => {
        const loadSettings = async () => {
            const response = await getWebsiteSettings();
            if (response.success) {
                setSettings(response.data);
            }
        };
        loadSettings();
    }, []);
    
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <div style={{ marginBottom: '20px' }}>
                            <Logo />
                        </div>
                        <p>{settings.footer_description || t('footer.description')}</p>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'nowrap', flexDirection: 'row', justifyContent: 'center' }}>
                            {settings.company_facebook && (
                                <a href={settings.company_facebook} target="_blank" rel="noopener noreferrer" className="text-accent">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                            )}
                            {settings.company_twitter && (
                                <a href={settings.company_twitter} target="_blank" rel="noopener noreferrer" className="text-accent">
                                    <i className="fab fa-twitter"></i>
                                </a>
                            )}
                            {settings.company_linkedin && (
                                <a href={settings.company_linkedin} target="_blank" rel="noopener noreferrer" className="text-accent">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            )}
                            {settings.company_instagram && (
                                <a href={settings.company_instagram} target="_blank" rel="noopener noreferrer" className="text-accent">
                                    <i className="fab fa-instagram"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="footer-col">
                        <h4>{t('footer.quickLinks')}</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">{t('footer.aboutUs')}</Link></li>
                            <li><Link to="/services">{t('footer.ourServices')}</Link></li>
                            <li><Link to="/projects">{t('footer.ourProjects')}</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>{t('footer.contactUs')}</h4>
                        <ul className="footer-links">
                            {settings.company_address && (
                                <li><i className="fas fa-map-marker-alt text-accent" style={{ marginRight: '10px' }}></i> {settings.company_address}</li>
                            )}
                            {settings.company_phone && (
                                <li><i className="fas fa-phone text-accent" style={{ marginRight: '10px' }}></i> {settings.company_phone}</li>
                            )}
                            {settings.company_email && (
                                <li><i className="fas fa-envelope text-accent" style={{ marginRight: '10px' }}></i> {settings.company_email}</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>{settings.footer_copyright || `© 2024 ${settings.company_name || 'MRB International'}. ${t('footer.allRightsReserved')}.`} | <a href="#">{t('footer.privacyPolicy')}</a> | <a href="#">{t('footer.termsOfService')}</a></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


