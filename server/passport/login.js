import { Strategy as PassportLocalStrategy } from 'passport-local'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { IncorrectCredentialsError, InternalServerError } from '../errors'

export default new PassportLocalStrategy(
	{
		usernameField: 'email',
		passwordField: 'password',
		session: false,
		passReqToCallback: true,
	},
	(req, email, password, done) => {
		console.log('IN STRATEGY')
		const userData = {
			email: req.body.email.trim(),
			password: req.body.password.trim(),
		}
		return User.findOne(
			{
				email: userData.email,
			},
			(err, user) => {
				if (err) return done(err)
				if (!user) return done(new IncorrectCredentialsError())

				return user.comparePassword(userData.password, (passwordErr, isMatch) => {
					// TODO: research this error
					if (passwordErr) return done(new InternalServerError())
					if (!isMatch) return done(new IncorrectCredentialsError())

					const payload = {
						sub: user._id,
					}

					const token = jwt.sign(payload, process.env.JWT_SECRET)
					const userObj = user.toObject()
					delete userObj.password

					return done(null, token, userObj)
				})
			},
		)
	},
)
