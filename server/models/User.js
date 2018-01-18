const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt');

const User = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null, unique: true },
    group: { type: String, default: 'user', lowercase: true, trim: true },
    hash: String
});

User.methods.comparePassword = function(hash, cb) {
	bcrypt.compare(hash, this.hash, cb)
}

User.pre('save', function(next) {
	const user = this
	if (!user.isModified('hash')) next();

	bcrypt.genSalt((saltError, salt) => {
		if (saltError) {
			console.log(saltError)
			return next(saltError)
		}
		bcrypt.hash(user.hash, salt, (hashError, hash) => {
			console.log('password', user.hash)
			console.log('salt', salt)
			if (hashError) next(hashError)

			user.hash = hash
			console.log(hash)
			next()
		})
	})
})

module.exports = mongoose.model('User', User);
