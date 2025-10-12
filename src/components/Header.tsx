import { useState, useEffect } from 'react';
import './Header.css';

export default function Header() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <header className="header">
      <h1 className="header-title">Job Board</h1>
      <div className="header-controls">
        <button onClick={() => setDarkMode(!darkMode)} className="header-btn">
          {darkMode ? 'Светлая тема' : 'Тёмная тема'}
        </button>
      </div>
    </header>
  );
}
