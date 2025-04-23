import { ThemeContext } from "../contexts/ThemeContext";
import { useContext } from "react";
import styles from "../styles/ComponentStyles/themeToggleButton.module.css"


export const ThemeToggleButton = () => {

    const { theme, toggle } = useContext(ThemeContext);

    return (
        <div className={`${styles.themeToggle} ${theme === 'dark' ? styles.dark : ''}`}>
            <label className={styles.switch}>
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggle}
                />
                <div className={styles.slider}>
                    <div className={styles.icons}>
                        <span className={styles.sun}>&#9728;</span>
                        <span className={styles.moon}>&#9790;</span>
                    </div>
                </div>
            </label>
        </div>
    )
}