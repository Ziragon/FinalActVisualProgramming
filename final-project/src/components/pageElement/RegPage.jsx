import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
<<<<<<< HEAD
import axios from 'axios';
=======
import axios from 'axios'; // Добавляем axios для HTTP-запросов
>>>>>>> origin/test-for-merge
import styles from '../../styles/AuthorizationPage.module.css';

const RegPage = () => {
    const navigate = useNavigate();
    const { login, userId } = useAuth();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Обязательное поле')
            .min(3, 'Логин должен содержать минимум 3 символа')
            .matches(
                /^[a-zA-Zа-яА-ЯёЁ0-9]+$/,
                'Логин может содержать только буквы и цифры'
            ),
        email: Yup.string()
            .required('Обязательное поле')
            .email('Введите корректный email'),
        password: Yup.string()
            .required('Обязательное поле')
            .min(6, 'Пароль должен содержать минимум 6 символов')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Пароль должен содержать хотя бы одну заглавную букву, одну строчную и одну цифру'
            ),
        confirmPassword: Yup.string()
            .required('Подтвердите пароль')
            .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                login: values.username,
                password: values.password,
                roleId: 3
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const responseLogin = await axios.post('http://localhost:5000/api/users/login', {
                login: values.username,
                password: values.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (responseLogin.data?.token) {
                await login(responseLogin.data.token);
            }

            const decoded = jwtDecode(responseLogin.data.token);
            const currentUserId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            await axios.put(`http://localhost:5000/api/profiles/${currentUserId}`, {
                fullName: '',
                email: values.email,
                institution: '',
                fieldOfExpertise: ''
            }, {
                headers: {
                    'Authorization': `Bearer ${responseLogin.data.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200 || response.status === 201) {
                navigate('/profile');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            if (error.response && error.response.data) {
                setErrors({ username: error.response.data.message || 'Ошибка регистрации' });
            } else {
                setErrors({ username: 'Произошла ошибка при регистрации' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleLoginClick = (e) => {
        e.preventDefault();
        navigate('/');
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.backgroundAnimation}></div>
            <div className={styles.window__authorization}>
                <div className={styles.auth__container}>
                    <h1 className={styles.auth__title}>Регистрация</h1>

                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
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
                                        placeholder="Придумайте логин"
                                    />
                                    <ErrorMessage name="username" component="div" className={styles.error__message} />
                                </div>

                                <div className={styles.form__group}>
                                    <label htmlFor="email" className={styles.form__label}>Email</label>
                                    <Field
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={styles.form__input}
                                        placeholder="Введите ваш email"
                                    />
                                    <ErrorMessage name="email" component="div" className={styles.error__message} />
                                </div>

                                <div className={styles.form__group}>
                                    <label htmlFor="password" className={styles.form__label}>Пароль</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        id="password"
                                        className={styles.form__input}
                                        placeholder="Придумайте пароль"
                                    />
                                    <ErrorMessage name="password" component="div" className={styles.error__message} />
                                </div>

                                <div className={styles.form__group}>
                                    <label htmlFor="confirmPassword" className={styles.form__label}>Подтвердите пароль</label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        className={styles.form__input}
                                        placeholder="Повторите пароль"
                                    />
                                    <ErrorMessage name="confirmPassword" component="div" className={styles.error__message} />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.auth__button}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className={styles.auth__links}>
                        <a href="#" className={styles.auth__link} onClick={handleLoginClick}>
                            Уже есть аккаунт? Войти
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegPage;