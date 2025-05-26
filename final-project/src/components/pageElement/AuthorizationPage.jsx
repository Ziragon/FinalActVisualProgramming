import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Импортируем наш хук
import axios from 'axios'; // Импортируем axios для HTTP-запросов
import styles from '../../styles/AuthorizationPage.module.css';

const AuthorizationPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth(); // Получаем isAuthenticated из хука

    // useEffect для редиректа, если пользователь уже аутентифицирован
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/profile'); // Или на другую страницу, куда нужно перенаправлять залогиненных пользователей
        }
    }, [isAuthenticated, navigate]);

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

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                login: values.username,
                password: values.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data?.token) {
                login(response.data.token); // Используем метод login из хука
                navigate('/profile');
            }
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            setErrors({ password: 'Неверный логин или пароль' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    // Если пользователь уже залогинен, не рендерим форму (можно отобразить сообщение)
    if (isAuthenticated) {
        return <div>Вы уже авторизованы.  Перенаправляю...</div>; // Или null, если ничего не нужно отображать
    }

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
                        <a href="https://rutube.ru/shorts/5a6a2d03b2a57eb896be17115e4ba6ed/" className={styles.auth__link}>Забыли пароль?</a>
                        <a href="#" className={styles.auth__link} onClick={handleRegisterClick}>Регистрация</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorizationPage;
