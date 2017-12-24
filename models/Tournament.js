const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose')

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true },
    date: Date,
    location: String,
    joinCode: { type: String, unique: true },
    scores: { type: Schema.Types.ObjectId, ref: 'Scoresheet' }
})

Tournament.index({
	'name': 1,
	'joinCode': 1
})

Tournament.on('index', (err) => console.log(err))

module.exports = mongoose.model('Tournament', Tournament)