'use client';
import { useTheme } from '@/context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            className={`${styles.toggleContainer} ${theme === 'dark' ? styles.dark : styles.light}`}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            role="switch"
            aria-checked={theme === 'dark'}
        >
            <div className={styles.toggleTrack}>
                {/* Light Mode Elements (Sky & Clouds) */}
                <div className={`${styles.skyBackground} ${theme === 'light' ? styles.active : ''}`}>
                    <div className={styles.cloud1}></div>
                    <div className={styles.cloud2}></div>
                    <div className={styles.cloud3}></div>
                </div>

                {/* Dark Mode Elements (Night Sky & Stars) */}
                <div className={`${styles.nightBackground} ${theme === 'dark' ? styles.active : ''}`}>
                    <div className={styles.star1}>✦</div>
                    <div className={styles.star2}>✦</div>
                    <div className={styles.star3}>✦</div>
                    <div className={styles.star4}>•</div>
                    <div className={styles.star5}>•</div>
                </div>

                {/* Toggle Orb (Sun / Moon) */}
                <div className={`${styles.toggleOrb} ${theme === 'dark' ? styles.orbDark : styles.orbLight}`}>
                    {theme === 'dark' ? (
                        /* Moon Craters */
                        <>
                            <div className={styles.crater1}></div>
                            <div className={styles.crater2}></div>
                            <div className={styles.crater3}></div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
