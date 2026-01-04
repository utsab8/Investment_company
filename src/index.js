import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { loadRemoteTranslations } from './services/i18nLoader';

const root = ReactDOM.createRoot(document.getElementById('root'));

async function start() {
  await loadRemoteTranslations();
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

start();
