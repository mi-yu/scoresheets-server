const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true, required: true },
    date: Date,
    state: { type: String, required: true},
    city: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    numTeams:  { type: Number, default: 0 },
    scores: { type: Schema.Types.ObjectId, ref: 'Scoresheet' }
})

Tournament.index({
	'name': 1,
	'joinCode': 1
})

Tournament.on('index', (err) => console.log(err))

module.exports = mongoose.model('Tournament', Tournament)