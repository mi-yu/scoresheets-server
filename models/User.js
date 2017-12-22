const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema({
    username: {type: String, default: null, unique: true},
    firstName: {type: String, default: null},
	lastName: {type: String, default: null},
    email: {type: String, default: null, unique: true},
    classOf: {type: Number},
    group: {type: String, default: 'member', lowercase: true, trim: true},
    approved: {type: Boolean, default: false}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);