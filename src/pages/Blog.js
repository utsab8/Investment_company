import React from 'react';
import { useTranslation } from 'react-i18next';
import './Blog.css';

const Blog = () => {
  const { t } = useTranslation();
  const posts = t('blogPage.posts', { returnObjects: true });

  return (
    <div className="page-template">
      <section className="page-header">
        <div className="container">
          <h1>{t('blogPage.headerTitle')}</h1>
          <p>{t('blogPage.headerSubtitle')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((post, index) => (
              <article key={index} className="blog-card">
                <div 
                  className="blog-image"
                  style={{ backgroundImage: `url('${post.image}')` }}
                ></div>
                <div className="blog-content">
                  <span className="blog-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <a href="#" className="btn btn-outline btn-small">{t('blogPage.readMore')}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
