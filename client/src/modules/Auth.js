class Auth {
	static storeToken(token) {
		localStorage.setItem('token', token)
	}

	static isAuthenticated() {
		return localStorage.getItem('token') !== null
	}

	static removeToken() {
		localStorage.removeItem('token')
	}

	static getToken() {
		return localStorage.getItem('token')
	}
}

export default Auth
