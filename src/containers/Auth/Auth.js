import React, {Component} from "react";
import classes from "./Auth.module.css";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";
import {connect} from "react-redux";
import {auth} from "../../store/actions/auth";

const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};

class Auth extends Component {
	state = {
		isFormValid: false,
		formControls: {
			email: {
				value: '',
				type: 'email',
				label: 'Email',
				errorMessage: 'Введите корректный email',
				valid: false,
				touched: false,
				validation: {
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				label: 'Пароль',
				errorMessage: 'Введите корректный пароль',
				valid: false,
				touched: false,
				validation: {
					required: true,
					minLength: 6
				}
			}
		}
	}

	loginHandler = () => {
		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			true
		);
	}

	registerHandler = () => {
		this.props.auth(
			this.state.formControls.email.value,
			this.state.formControls.password.value,
			false
		);

		// try {
		// 	const response = await axios.post(
		// 		'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAModxk6m7cOzFYCQelDJDuhoueK7GrpC0',
		// 		authData
		// 	);
		//
		// 	console.log(response.data);
		// } catch (e) {
		// 	console.log(e);
		// }
	}

	submitHandler = event => {
		event.preventDefault();
	}

	onChangeHandler = (event, controlName) => {
		const formControls = { ...this.state.formControls };
		const control = { ...formControls[controlName] };

		control.value = event.target.value;
		control.touched = true;
		control.valid = this.validateControl(control.value, control.validation);

		formControls[controlName] = control;

		const isFormValid = !Object.keys(formControls).find((controlName) => !formControls[controlName].valid);

		this.setState({
			isFormValid,
			formControls
		});
	}

	validateControl(value, validation) {
		if (!validation) {
			return true;
		}

		let isValid = true;

		if (validation.required) {
			isValid = !!value.trim() && isValid;
		}

		if (validation.email) {
			isValid = validateEmail(value) && isValid;
		}

		if (validation.minLength) {
			isValid = value.length >= validation.minLength && isValid;
		}

		return isValid;
	}

	renderInputs () {
		return Object.keys(this.state.formControls)
			.map((controlName, index) => {
				const control = this.state.formControls[controlName];

				return (
					<Input
						key={controlName + index}
						type={control.type}
						label={control.label}
						value={control.value}
						touched={control.touched}
						valid={control.valid}
						shouldValidate={!!control.validation}
						errorMessage={control.errorMessage}
						onChange={event => this.onChangeHandler(event, controlName)}
					/>
				)
			});
	}

	render() {
		return (
			<div className={classes.Auth}>
				<div>
					<h1>Авторизация</h1>

					<form className={classes.AuthForm} onSubmit={this.submitHandler}>
						{this.renderInputs()}

						<Button
							type="success"
							disabled={!this.state.isFormValid}
							onClick={this.loginHandler}
						>
							Войти
						</Button>
						<Button
							type="primary"
							disabled={!this.state.isFormValid}
							onClick={this.registerHandler}
						>
							Зарегистрироваться
						</Button>
					</form>
				</div>
			</div>
		);
	};
}

function mapDispatchToProps(dispatch) {
	return {
		auth: (email, password, isLogin) => dispatch(auth(email, password, isLogin))
	}
}

export default connect(null, mapDispatchToProps)(Auth);

