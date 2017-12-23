const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

const Scoresheet = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament'},
    events: [
    	{
    		event: { type: Schema.Types.ObjectId, ref: 'Event'},
    		scores: [{
    			team: { type: Schema.Types.ObjectId, ref: 'Team' },
    			rawScore: Number,
    			rank: Number,
    			highWins: { type: Boolean, default: true }
    		}]
    	}
    ]
});

Scoresheet.plugin(passportLocalMongoose);

module.exports = mongoose.model('Scoresheet', Scoresheet);