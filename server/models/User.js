const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');

const User = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null, unique: true },
    group: { type: String, default: 'user', lowercase: true, trim: true },
    password: String
});

User.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, cb)
}

User.pre('save', function(next) {
	const user = this
	if (!user.isModified('password')) next();

	bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			console.log(saltError)
			return next(saltError)
		}
		bcrypt.hash(user.password, salt, (hashError, password) => {
			console.log('password', user.password)
			console.log('salt', salt)
			if (hashError) next(hashError)

			user.password = password
			console.log(password)
			next()
		})
	})
})

module.exports = mongoose.model('User', User);
