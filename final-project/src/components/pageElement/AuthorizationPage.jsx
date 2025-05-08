import React from 'react';
import styles from '../../styles/AuthorizationPage.module.css';

const AuthorizationPage = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.backgroundAnimation}></div>
            <div className={styles.window__authorization}>
                <div className={styles.auth__container}>
                    <h1 className={styles.auth__title}>Авторизация</h1>
                    <form className={styles.auth__form}>
                        <div className={styles.form__group}>
                            <label htmlFor="username" className={styles.form__label}>Логин</label>
                            <input
                                type="text"
                                id="username"
                                className={styles.form__input}
                                placeholder="Введите ваш логин"
                            />
                        </div>
                        <div className={styles.form__group}>
                            <label htmlFor="password" className={styles.form__label}>Пароль</label>
                            <input
                                type="password"
                                id="password"
                                className={styles.form__input}
                                placeholder="Введите ваш пароль"
                            />
                        </div>
                        <button type="submit" className={styles.auth__button}>Войти</button>
                    </form>
                    <div className={styles.auth__links}>
                        <a href="#" className={styles.auth__link}>Забыли пароль?</a>
                        <a href="#" className={styles.auth__link}>Регистрация</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorizationPage;