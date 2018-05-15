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
			return next(saltError)
		}
		bcrypt.hash(user.password, salt, (hashError, password) => {
			if (hashError) next(hashError)

			user.password = password
			next()
		})
	})
})

module.exports = mongoose.model('User', User);
