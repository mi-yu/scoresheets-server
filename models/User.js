const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    name: {type: String, default: null},
    email: {type: String, default: null, unique: true},
    group: {type: String, default: 'user', lowercase: true, trim: true}
});

User.plugin(passportLocalMongoose, {
	usernameField: 'email'
});

module.exports = mongoose.model('User', User);