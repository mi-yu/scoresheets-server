const User = require('../models/User')
const PassportLocalStrategy = require('passport-local').Strategy

module.exports = new PassportLocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (req, email, password, done) => {
	console.log('Fffffffffffffff')
	const newUser = new User({
		email: email.trim(),
		password: password.trim(),
		name: req.body.name.trim()
	})

	newUser.save((err) => {
		if (err) {
			console.log(err)
			return done(err)
		}
		return done(null)
	})
})