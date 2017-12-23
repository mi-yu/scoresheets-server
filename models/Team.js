const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

const Team = new Schema({
	tournament: { type: Schema.Types.ObjectId, ref: 'Tournament' },
	teamNumber: String,
	score: Number,
	placing: Number
});

Team.plugin(passportLocalMongoose);

module.exports = mongoose.model('Team', Team);