import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { AppTheme } from './theme/index.tsx';
import AppRoutes from './pages/index.tsx';
import { executeIntersectorInInstaces } from '@storages/axios/instances.ts';
import { SnackBar } from '@templates/snack_bar/index.tsx';
import { Favicon } from '@organisms/favicon.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterLuxon } from '@mui/x-date-pickers-pro/AdapterLuxon';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import './main.css';

executeIntersectorInInstaces();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Suspense>
            <AppTheme>
                <Favicon />
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                    <AppRoutes />
                </LocalizationProvider>
                <SnackBar />
            </AppTheme>
        </Suspense>
    </StrictMode>,
);
