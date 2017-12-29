const mongoose = require('mongoose'),
    Schema = mongoose.Schema

const Score = new Schema({
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    rawScore: Number,
    tier: { type: Number, default: 1, required: true },
    noShow: { type: Boolean, default: false },
    participationOnly: { type: Boolean, default: false },
    rank: Number
}, {_id: false})

const ScoresheetEntry = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    scores: [Score],
    locked: { type: Boolean, default: false}
}, {_id: false})

const Scoresheet = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament'},
    entries: [ScoresheetEntry]
})

module.exports = mongoose.model('Scoresheet', Scoresheet)