import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const User = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: true,
	},
	group: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
		enum: ['admin', 'user', 'director', 'supervisor'],
	},
	password: { type: String, required: true },
})

User.methods.comparePassword = function (password, cb) {
	bcrypt.compare(password, this.password, cb)
}

User.pre('save', function (next) {
	// User being saved
	const user = this

	bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			return next(saltError)
		}

		bcrypt.hash(user.password, salt, (hashError, password) => {
			if (hashError) next(hashError)

			// Set hash as the new password to save in DB.
			user.password = password
			return next()
		})
	})
})

export default mongoose.model('User', User)
