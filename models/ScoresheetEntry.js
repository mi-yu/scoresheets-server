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
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true},
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    scores: [Score],
    locked: { type: Boolean, default: false}
})

module.exports = mongoose.model('ScoresheetEntry', ScoresheetEntry)