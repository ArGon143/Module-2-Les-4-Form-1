import { useState, useRef } from 'react';
import styles from './App.module.css';

const initialState = {
	email: '',
	password: '',
	repeatPassword: '',
};

const useStore = () => {
	const [state, setState] = useState(initialState);

	return {
		getState: () => state,
		updateState: (fieldName, newValue) => {
			setState({ ...state, [fieldName]: newValue });
		},
		resetState: () => {
			setState(initialState);
		},
	};
};

const sendFormData = (formData) => {
	console.log(formData);
};

export const App = () => {
	const { getState, updateState, resetState } = useStore();
	const { email, password, repeatPassword } = getState();

	const [alertMessage, setAlertMessage] = useState();
	const [checkMessage, setCheckMessage] = useState();

	const submitButtonRef = useRef(null);

	const checkCheckMessage = () => {
		if (checkMessage) {
			setCheckMessage();
		}
	};

	const onSubmit = (event) => {
		event.preventDefault();
		checkCheckMessage();

		if (email === '' || password === '' || repeatPassword === '') {
			setAlertMessage('Поля не заполнены');
		} else if (repeatPassword !== password) {
			setAlertMessage('Пароли не совпадают');
		} else {
			sendFormData(getState());
			setCheckMessage('Вы успешно зарегистрированы');
			resetState();
		}
	};

	const onChange = ({ target }) => {
		updateState(target.name, target.value);
		checkCheckMessage();
	};

	const onBlur = ({ target }) => {
		checkCheckMessage();

		let newAlertMessage = null;

		if (email !== '') {
			if (
				!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
					email,
				)
			) {
				newAlertMessage = 'Некоректный адрес электронной почты';
			}
		} else if (password !== '') {
			if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
				newAlertMessage =
					'Пароль должен состоять из не менее 6 символов, содержать буквы верхнего и нижнего регистра, по крайней мере один специальный символ и одну цифру.';
			}
		}
		if (email !== '' && password !== '' && repeatPassword !== '') {
			submitButtonRef.current.focus();
		}

		setAlertMessage(newAlertMessage);
	};

	return (
		<div className={styles.app}>
			<section className={styles.firstSection}>
				{alertMessage && (
					<div className={styles.alertMessage}>{alertMessage}</div>
				)}
				{checkMessage && (
					<div className={styles.checkMessage}>{checkMessage}</div>
				)}
			</section>
			<section className={styles.section}>
				<form onSubmit={onSubmit} noValidate>
					<h1 className={styles.divLabelForm}>Введите Ваши данные</h1>
					<input
						name="email"
						type="email"
						placeholder="Почта"
						autoFocus
						value={email}
						onChange={onChange}
						onBlur={onBlur}
					/>
					<input
						name="password"
						type="password"
						placeholder="Пароль"
						value={password}
						onChange={onChange}
						onBlur={onBlur}
					/>
					<input
						name="repeatPassword"
						type="password"
						placeholder="Повторите пароль"
						value={repeatPassword}
						onChange={onChange}
						onBlur={onBlur}
					/>
					<button
						className={styles.subButton}
						type="submit"
						disabled={!!alertMessage}
						ref={submitButtonRef}
					>
						Зарегистрироваться
					</button>
				</form>
			</section>
		</div>
	);
};
