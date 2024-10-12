// ThemeContext.ts
import React from 'react';

export const themes = {
    light: {
        foreground: '#000000',
        background: '#eeeeee',
        noteBackground: '#f9f9f9',
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
        noteBackground: '#a0a3a2',
    },
};

export const ThemeContext = React.createContext(themes.light);