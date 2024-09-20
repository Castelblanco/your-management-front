import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode, useCallback } from 'react';
import { useAppTheme } from '../storages/zustand/app_theme';

type TAppThemeProps = {
    children: ReactNode;
};

export const AppTheme = ({ children }: TAppThemeProps) => {
    const { mode } = useAppTheme();
    const isDark = mode === 'dark';
    const theme = useCallback(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: isDark ? '#616161' : '#b71c1c',
                    },
                    secondary: {
                        main: isDark ? '#FFF' : '#676778',
                    },
                    error: {
                        main: isDark ? '#b71c1c' : '#d32f2f',
                    },
                },
                components: {
                    MuiCard: {
                        styleOverrides: {
                            root: {
                                background: isDark ? '#212121' : '#FFF',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                WebkitTextFillColor: isDark ? '#FFF' : '#000',
                            },
                        },
                    },
                    MuiTableContainer: {
                        styleOverrides: {
                            root: {
                                borderColor: isDark
                                    ? '#ffffff1f !important'
                                    : '#e0e0e0 !important',
                                border: 1,
                                borderStyle: 'solid',
                            },
                        },
                    },
                    MuiCssBaseline: {
                        styleOverrides: {
                            '*::-webkit-scrollbar': {
                                width: '8px',
                                height: '8px',
                            },
                            '*::-webkit-scrollbar-thumb': {
                                backgroundColor: isDark ? '#616161' : '#b71c1c', // Primary color
                                borderRadius: '10px',
                            },
                            '*::-webkit-scrollbar-thumb:hover': {
                                backgroundColor: isDark ? '#424242' : '#d32f2f', // Error color on hover
                            },
                            '*::-webkit-scrollbar-track': {
                                backgroundColor: isDark ? '#303030' : '#f0f0f0', // Track color based on mode
                            },
                        },
                    },
                },
            }),
        [mode, isDark],
    );

    return (
        <ThemeProvider theme={theme()}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
