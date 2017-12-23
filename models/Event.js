const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

const Event = new Schema({
	eventName : {type: String, unique: true},
	inRotation : {type: Boolean, default: false},
	isBuilding : {type: Boolean, default: false},
	isImpounded : {type: Boolean, default: false},
	isStateEvent : {type: Boolean, default: false},
	topics: [String],
	currentTopic: String,
	notes: String
});

module.exports = mongoose.model('Event', Event);