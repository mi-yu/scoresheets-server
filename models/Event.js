const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const Event = new Schema({
	name : {type: String, unique: true},
	inRotation : {type: Boolean, default: false},
	building : {type: Boolean, default: false},
	impound : {type: Boolean, default: false},
	stateEvent : {type: Boolean, default: false},
	topics: [String],
	currentTopic: String,
	notes: String
});

module.exports = mongoose.model('Event', Event);