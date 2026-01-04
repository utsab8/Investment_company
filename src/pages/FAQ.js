import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './FAQ.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { t } = useTranslation();

  const faqs = t('faq.items', { returnObjects: true });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('faq.headerTitle')}</h1>
          <p>{t('faq.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-container">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`accordion-item ${activeIndex === index ? 'active' : ''}`}
            >
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                <h3>{faq.question}</h3>
                <i className={`fas fa-chevron-down accordion-icon ${activeIndex === index ? 'rotated' : ''}`}></i>
              </div>
              <div className="accordion-content">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
