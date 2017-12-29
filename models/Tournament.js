const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const TournamentEvent = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    supervisors: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    locked: {
        type: Boolean,
        default: false
    }
}, {_id: false})

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true, required: true },
    date: Date,
    state: { type: String, required: true},
    city: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    numTeams:  { type: Number, default: 0 },
    scores: { type: Schema.Types.ObjectId, ref: 'Scoresheet' },
    events: [TournamentEvent]
})

module.exports = mongoose.model('Tournament', Tournament)