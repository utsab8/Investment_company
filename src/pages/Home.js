import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const hero = t('home.hero', { returnObjects: true });
  const overview = t('home.overview', { returnObjects: true });
  const values = t('home.values', { returnObjects: true });
  const planCards = t('home.plans.cards', { returnObjects: true });
  const testimonials = t('home.testimonials', { returnObjects: true });
  const blog = t('home.blog', { returnObjects: true });
  const newsletter = t('home.newsletter', { returnObjects: true });

  // Get background image from translations, fallback to default
  const backgroundImage = t('home.hero.background') || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
  
  // Build background style
  const heroStyle = {
    background: `linear-gradient(rgba(10, 37, 64, 0.8), rgba(10, 37, 64, 0.7)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(newsletter.success);
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" style={heroStyle}>
        <div className="container hero-content">
          <span className="hero-subtitle">{hero.subtitle}</span>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-text">{hero.text}</p>
          <div className="hero-buttons">
            <Link to="/plans" className="btn btn-primary">{hero.primaryCta}</Link>
            <Link to="/contact" className="btn btn-outline">{hero.secondaryCta}</Link>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="section overview-section">
        <div className="container">
          <div className="overview-content">
            <div className="overview-image">
              <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Meeting" 
                loading="lazy"
              />
            </div>
            <div className="overview-text">
              <h4 className="text-accent">{overview.badge}</h4>
              <h2>{overview.title}</h2>
              <p>{overview.text}</p>
              <ul className="overview-list">
                {overview.list.map((item, idx) => (
                  <li key={idx}><i className="fas fa-check-circle text-accent"></i> {item}</li>
                ))}
              </ul>
              <Link to="/about" className="btn btn-secondary">{overview.cta}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Value Proposition */}
      <section className="section value-section">
        <div className="container">
          <div className="text-center value-header">
            <h2>{values.title}</h2>
            <p>{values.subtitle}</p>
          </div>

          <div className="value-cards">
            {values.cards.map((card, idx) => (
              <div key={idx} className="value-card">
                <div className="value-icon">
                  <i className={`fas ${idx === 0 ? 'fa-shield-alt' : idx === 1 ? 'fa-chart-line' : 'fa-users'}`}></i>
                </div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Plans Preview */}
      <section className="section plans-preview-section">
        <div className="container">
          <div className="text-center plans-header">
            <h4 className="text-accent">{t('home.plans.badge')}</h4>
            <h2>{t('home.plans.title')}</h2>
          </div>

          <div className="plans-preview-grid">
            {planCards.map((plan, idx) => (
              <div key={idx} className={`plan-preview-card ${plan.badge ? 'featured' : ''}`}>
                {plan.badge && <div className="popular-badge">{plan.badge}</div>}
                <h3 className={idx === 0 || idx === 2 ? 'text-primary' : ''}>{plan.name}</h3>
                <div className="plan-preview-price">
                  {plan.rate.split(' ')[0]} <span>{plan.rate.includes('/') ? plan.rate.split(' ').slice(1).join(' ') : ''}</span>
                </div>
                <p>{plan.desc}</p>
                <Link to="/plans" className={`btn ${plan.badge ? 'btn-primary' : 'btn-outline'}`}>{plan.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials-section">
        <div className="container text-center">
          <h2>{t('home.testimonials.title')}</h2>
          <div className="testimonials-grid">
            {testimonials.list.map((item, idx) => (
              <div key={idx} className="testimonial-card">
                <p className="testimonial-text">
                  {item.text}
                </p>
                <div className="testimonial-author">
                  <img
                    src={
                      idx === 0
                        ? 'https://randomuser.me/api/portraits/men/32.jpg'
                        : idx === 1
                        ? 'https://randomuser.me/api/portraits/women/44.jpg'
                        : 'https://randomuser.me/api/portraits/men/85.jpg'
                    }
                    alt="Client"
                    loading="lazy"
                  />
                  <div>
                    <h4>{item.name}</h4>
                    <span>{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Insights Preview */}
      <section className="section blog-preview-section">
        <div className="container">
          <div className="blog-preview-header">
            <div>
                <h4 className="text-accent">{blog.badge}</h4>
                <h2>{blog.title}</h2>
            </div>
              <Link to="/blog" className="btn btn-outline desktop-only">{blog.viewAllDesktop}</Link>
          </div>

          <div className="blog-preview-grid">
              {blog.posts.map((post, idx) => {
                const images = [
                  "url('https://images.unsplash.com/photo-1611974765270-ca12586343bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                  "url('https://images.unsplash.com/photo-1579532551697-495dca3c3fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                  "url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
                ];

                return (
                  <div key={idx} className="blog-preview-card">
                    <div
                      className="blog-preview-image"
                      style={{ backgroundImage: images[idx] }}
                    ></div>
                    <div className="blog-preview-content">
                      <span>{post.date}</span>
                      <h4>{post.title}</h4>
                      <Link to="/blog" className="text-accent">{blog.readMore} <i className="fas fa-arrow-right"></i></Link>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="text-center" style={{ marginTop: '30px' }}>
              <Link to="/blog" className="btn btn-outline mobile-only">{blog.viewAllMobile}</Link>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section newsletter-section">
        <div className="container newsletter-container">
          <h2>{newsletter.title}</h2>
          <p>{newsletter.text}</p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input type="email" placeholder={newsletter.placeholder} required />
            <button type="submit" className="btn btn-primary">{newsletter.button}</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
