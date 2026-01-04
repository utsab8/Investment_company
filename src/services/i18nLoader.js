import i18n from '../i18n';
import { API_BASE_URL } from '../config';

export async function loadRemoteTranslations() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/i18n`);
    if (!res.ok) {
      throw new Error(`Status ${res.status}`);
    }
    const payload = await res.json();
    const translations = payload.translations || {};
    Object.entries(translations).forEach(([lang, data]) => {
      // Data already matches the "translation" namespace shape
      i18n.addResourceBundle(lang, 'translation', data, true, true);
    });
  } catch (err) {
    console.warn('Remote i18n load failed, using built-in strings', err);
  }
}

