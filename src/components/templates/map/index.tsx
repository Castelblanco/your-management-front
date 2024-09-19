import { Ref } from 'react';
import styles from './styles.module.css';

export type TMapProps = {
    mapElement: Ref<HTMLDivElement>;
    disable?: boolean;
};

export const Map = ({ mapElement }: TMapProps) => {
    return <div ref={mapElement} className={styles.container}></div>;
};
