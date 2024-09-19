import { useAppTheme } from '@storages/zustand/app_theme';
import { useEffect, useState } from 'react';
import FV from 'react-favicon';

export const Favicon = () => {
    const { setMode } = useAppTheme();

    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const mq = matchMedia('(prefers-color-scheme: dark)');
        setIsDark(mq.matches);
        setMode(mq.matches ? 'dark' : 'light');

        const onChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
            setMode(e.matches ? 'dark' : 'light');
        };

        mq.addEventListener('change', onChange);
        return () => {
            mq.removeEventListener('change', onChange);
        };
    }, []);

    return <FV url={isDark ? '/favicon-dark.png' : '/favicon-light.png'} />;
};
