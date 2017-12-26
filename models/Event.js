const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const Event = new Schema({
	name : {type: String, unique: true},
	inRotation : {type: Boolean, default: false},
	isBuilding : {type: Boolean, default: false},
	isImpounded : {type: Boolean, default: false},
	isStateEvent : {type: Boolean, default: false},
	topics: [String],
	currentTopic: String,
	notes: String
});

module.exports = mongoose.model('Event', Event);