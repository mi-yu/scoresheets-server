const mongoose = require('mongoose')
const { Schema } = mongoose

const Event = new Schema({
	name: { type: String, unique: true, required: true },
	category: {
		type: String,
		required: true,
		default: 'none',
	} /* Life science, engineering, etc... */,
	division: {
		type: String,
		required: true,
		enum: ['B', 'C', 'BC'],
	} /* An event can, based on the season, be in any combination of divison B/C. */,
	inRotation: { type: Boolean, default: false },
	impound: { type: Boolean, default: false },
	stateEvent: {
		type: Boolean,
		default: false,
	} /* Synonymous with trial event */,
	topics: [String] /* Event specific topics, like Nervous System for A&P */,
	currentTopic: String,
	notes: String,
	highScoreWins: {
		type: Boolean,
		default: true,
	} /* In some events, the lowest score wins (Electric Vehicle, Scrambler, etc). */,
})

module.exports = mongoose.model('Event', Event)
