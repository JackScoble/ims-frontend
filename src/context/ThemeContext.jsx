import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('themePreference') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (systemPrefersDark) {
                root.classList.add('dark');
            }
        } else if (theme === 'dark') {
            root.classList.add('dark');
        }
        
        localStorage.setItem('themePreference', theme);
        
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);