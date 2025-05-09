import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from '../../styles/AuthorizationPage.module.css';

const AuthorizationPage = () => {
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Обязательное поле')
            .min(3, 'Логин должен содержать минимум 3 символа')
            .matches(
                /^[a-zA-Zа-яА-ЯёЁ0-9]+$/,
                'Логин может содержать только буквы и цифры'
            ),
        password: Yup.string()
            .required('Обязательное поле')
            .min(6, 'Пароль должен содержать минимум 6 символов'),
    });
    // ЗДЕСЬ БУДЕТ API ДЛЯ АВТОРИЗАЦИИ В БД!!!!
    const handleSubmit = (values, { setSubmitting }) => {
        console.log('Отправка данных:', values);
        setTimeout(() => {
            setSubmitting(false);
        }, 1000);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.backgroundAnimation}></div>
            <div className={styles.window__authorization}>
                <div className={styles.auth__container}>
                    <h1 className={styles.auth__title}>Авторизация</h1>

                    <Formik
                        initialValues={{ username: '', password: '' }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className={styles.auth__form}>
                                <div className={styles.form__group}>
                                    <label htmlFor="username" className={styles.form__label}>Логин</label>
                                    <Field
                                        type="text"
                                        name="username"
                                        id="username"
                                        className={styles.form__input}
                                        placeholder="Введите ваш логин"
                                    />
                                    <ErrorMessage name="username" component="div" className={styles.error__message} />
                                </div>

                                <div className={styles.form__group}>
                                    <label htmlFor="password" className={styles.form__label}>Пароль</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        className={styles.form__input}
                                        placeholder="Введите ваш пароль"
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error__message} />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.auth__button}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Вход...' : 'Войти'}
                                </button>
                            </Form>
                        )}
                    </Formik>

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