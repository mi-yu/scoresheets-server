const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')

const User = new Schema({
	firstName: String,
	lastName: String,
	email: { type: String, unique: true, required: true },
	group: {
		type: String,
		required: true,
		lowercase: true,
		trim: true,
	},
	password: String,
})

User.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, cb)
}

User.pre('save', function(next) {
	const user = this

	bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			return next(saltError)
		}
		bcrypt.hash(user.password, salt, (hashError, password) => {
			if (hashError) next(hashError)

			user.password = password
			return next()
		})
	})
})

module.exports = mongoose.model('User', User)
