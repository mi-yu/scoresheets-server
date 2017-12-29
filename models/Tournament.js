const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true, required: true },
    date: Date,
    state: { type: String, required: true},
    city: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    numTeams:  { type: Number, default: 0 },
    scores: { type: Schema.Types.ObjectId, ref: 'Scoresheet' },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
})

module.exports = mongoose.model('Tournament', Tournament)