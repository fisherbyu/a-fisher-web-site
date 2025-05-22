import { createTheme, ThemeConfig } from 'thread-ui';

export const newConfig: ThemeConfig = {
    primary: {
        light: '#4f46e5',
        main: '#4338ca',
        dark: '#3730a3',
    },
};

const oldConfig = {
    colors: {
        primary: {
            light: '#4f46e5',
            main: '#4338ca',
            dark: '#3730a3',
        },
        text: {
            primary: '#4760b3',
        },
    },
} as const;

// Initialize Theme
export const ThreadTheme = createTheme(oldConfig);
