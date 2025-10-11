import { useState, useEffect } from 'react';
import './Header.css';
import { translations } from '../shared/i18n/translations';

type Language = 'ru' | 'en';

export default function Header() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'ru';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <header className="header">
      <h1 className="header-title">{t.jobBoard}</h1>
      <div className="header-controls">
        <button onClick={() => setDarkMode(!darkMode)} className="header-btn">
          {darkMode ? t.lightTheme : t.darkTheme}
        </button>
        <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} className="header-btn">
          {lang.toUpperCase()}
        </button>
      </div>
    </header>
  );
}
