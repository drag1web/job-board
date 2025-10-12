import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './Header.css';
export default function Header() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'true';
    });
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', String(darkMode));
    }, [darkMode]);
    return (_jsxs("header", { className: "header", children: [_jsx("h1", { className: "header-title", children: "Job Board" }), _jsx("div", { className: "header-controls", children: _jsx("button", { onClick: () => setDarkMode(!darkMode), className: "header-btn", children: darkMode ? 'Светлая тема' : 'Тёмная тема' }) })] }));
}
