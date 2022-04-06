import axios from "axios";
import {AUTH_LOGOUT, AUTH_SUCCESS} from "./actionTypes";

export function auth(email, password, isLogin) {
	return async dispatch => {
		const authData = {
			email,
			password,
			returnSecureToken: true
		};

		const url = isLogin
			? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAModxk6m7cOzFYCQelDJDuhoueK7GrpC0'
			: 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAModxk6m7cOzFYCQelDJDuhoueK7GrpC0';

		const response = await axios.post(url, authData);
		const { idToken, localId, expiresIn } = response.data;

		const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

		localStorage.setItem('token', idToken);
		localStorage.setItem('userId', localId);
		localStorage.setItem('expirationDate', expirationDate);

		dispatch(authSuccess(idToken));
		dispatch(autoLogout(expiresIn));
	}
}

export function autoLogin() {
	return dispatch => {
		const token = localStorage.getItem('token');

		if(!token) {
			dispatch(logout())
		} else {
			const expirationDate = new Date(localStorage.getItem('expirationDate'));

			if (expirationDate <= new Date()) {
				dispatch(logout());
			} else {
				dispatch(authSuccess(token));
				dispatch(autoLogout((expirationDate.getTime() - new Date().getTime()) / 1000));
			}
		}
	}
}

export function authSuccess(token) {
	return {
		type: AUTH_SUCCESS,
		token
	};
}

export function autoLogout(time) {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, time * 1000)
	};
}

export function logout() {
	localStorage.removeItem('token');
	localStorage.removeItem('userId');
	localStorage.removeItem('expirationDate');

	return {
		type: AUTH_LOGOUT
	}
}