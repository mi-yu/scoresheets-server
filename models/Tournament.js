const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

const Tournament = new Schema({
    name: { type: String, unique: true },
    date: Date,
    joinCode: { type: String, unique: true },
    scores: { type: Schema.Types.ObjectId, ref: 'Scoresheet' }
});

Tournament.plugin(passportLocalMongoose);

module.exports = mongoose.model('Tournament', Tournament);