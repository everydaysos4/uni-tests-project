import styles from './home.module.css';

export const Home = () => {
  return (
    <section className={styles.homeSection}>
      <h1>
        Добро пожаловать в <span className={styles.name}>TEAM DIRECTORY</span>
      </h1>
    </section>
  );
};
