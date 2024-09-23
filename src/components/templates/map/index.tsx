import { Ref } from 'react';
import styles from './styles.module.css';

export type TMapProps = {
    mapElement: Ref<HTMLDivElement>;
    className?: string;
};

export const Map = ({ mapElement, className }: TMapProps) => {
    return <div ref={mapElement} className={`${styles.container} ${className}`} />;
};
