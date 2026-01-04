import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Contact.css';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const subjectOptions = useMemo(
    () => t('contact.subjectOptions', { returnObjects: true }),
    [t, i18n.language]
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: subjectOptions[0],
    message: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      subject: subjectOptions[0]
    }));
  }, [subjectOptions]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(t('contact.successMessage'));
    setFormData({ name: '', email: '', subject: subjectOptions[0], message: '' });
  };

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('contact.headerTitle')}</h1>
          <p>{t('contact.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2 className="text-primary" style={{ marginBottom: '30px' }}>{t('contact.infoTitle')}</h2>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h4>{t('contact.addressTitle')}</h4>
                  <p>{t('contact.addressLine1')}<br />{t('contact.addressLine2')}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h4>{t('contact.phoneTitle')}</h4>
                  <p>{t('contact.phoneLine1')}<br />{t('contact.phoneLine2')}</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <h4>{t('contact.emailTitle')}</h4>
                  <p>{t('contact.emailLine1')}<br />{t('contact.emailLine2')}</p>
                </div>
              </div>

              <div className="map-container">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.01104108459503!3d40.70780367933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a165bedccab%3A0x2cb2ddf003b5ae!2sWall%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1646813290635!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '10px' }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2 className="text-primary" style={{ marginBottom: '30px' }}>{t('contact.formTitle')}</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label>{t('contact.fields.nameLabel')}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('contact.fields.namePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('contact.fields.emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('contact.fields.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('contact.fields.subjectLabel')}</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    {subjectOptions.map((option, idx) => (
                      <option key={idx}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('contact.fields.messageLabel')}</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder={t('contact.fields.messagePlaceholder')}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">{t('contact.submitText')}</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
