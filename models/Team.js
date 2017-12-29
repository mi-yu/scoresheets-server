const mongoose = require('mongoose'),
	Schema = mongoose.Schema

const Team = new Schema({
	tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
	school: String,
	teamNumber: { type: String, required: true },
	score: Number,
	placing: Number
})

module.exports = mongoose.model('Team', Team)