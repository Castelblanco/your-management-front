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
                    // MuiPaper: {
                    //     styleOverrides: {
                    //         root: {
                    //             background: isDark ? '#212121' : '#b71c1c',
                    //         },
                    //     },
                    // },
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
