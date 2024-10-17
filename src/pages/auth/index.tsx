import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';

export default function AuthRoutes() {
    return (
        <>
            <Outlet />
            <footer className={styles.footer}>
                Desarrollado Y Diseñado por El equipo VMC. ©2024. Todos los derechos
                reservados.
            </footer>
        </>
    );
}
