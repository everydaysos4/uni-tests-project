import { NavLink } from 'react-router-dom';
import styles from './navigation.module.css';

export const Navigation = () => {
  return (
    <header className={styles.navigate}>
      <NavLink
        to="/"
        className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ''}`}
      >
        TEAM DIRECTORY
      </NavLink>
      <NavLink
        to="/users"
        className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ''}`}
      >
        Сотрудники платформы
      </NavLink>
      <NavLink
        to="/groups"
        className={({ isActive }) => `${styles.item} ${isActive ? styles.itemActive : ''}`}
      >
        Рабочие группы
      </NavLink>
    </header>
  );
};
