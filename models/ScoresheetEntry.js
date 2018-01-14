const mongoose = require('mongoose'), Schema = mongoose.Schema;

const Score = new Schema({
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    rawScore: Number,
    tiebreaker: Number,
    tier: { type: Number, default: 1, required: true },
    dq: { type: Boolean, default: false },
    noShow: { type: Boolean, default: false },
    participationOnly: { type: Boolean, default: false },
    dropped: { type: Boolean, default: false },
    rank: Number,
    notes: String
});

const ScoresheetEntry = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    scores: [ Score ],
    maxScore: Number,
    locked: { type: Boolean, default: false }
});

ScoresheetEntry.methods.rank = function(cb) {
    let scores = this.scores;
    scores.sort((s1, s2) => {
        if (s1.dropped > s2.dropped)
            return 1;
        if (s1.dropped < s2.dropped)
            return -1;
        if (s1.dq > s2.dq)
            return 1
        if (s1.dq < s2.dq)
            return -1
        if (s1.noShow > s2.noShow)
            return 1;
        if (s1.noShow < s2.noShow)
            return -1;
        if (s1.participationOnly > s2.participationOnly)
            return 1;
        if (s1.participationOnly < s2.participationOnly)
            return -1;
        if (s1.tier > s2.tier)
            return 1;
        if (s1.tier < s2.tier)
            return -1;
        if (s1.rawScore === 0)
            return 1
        if (s1.rawScore > s2.rawScore)
            return -1;
        if (s1.rawScore < s2.rawScore)
            return 1;
        if (s1.rawScore === s2.rawScore && s1.tiebreaker < s2.tiebreaker)
            return 1;
        if (s1.rawScore === s2.rawScore && s1.tiebreaker > s2.tiebreaker)
            return -1;
        throw new Error('Tie must be broken between');
    });

    scores.forEach((score, i) => {
        if (!score.dq && !score.noShow && !score.participationOnly && !score.dropped && score.rawScore !== 0)
            score.rank = i + 1;
        else {
            if (score.rawScore === 0)
                score.rank = scores.length;
            if (score.dq)
                score.rank = scores.length + 2;
            if (score.noShow)
                score.rank = scores.length + 1;
            if (score.participationOnly)
                score.rank = scores.length;
            if (score.dropped)
                score.rank = 0;
        }
    });
    
    this.save(err => {
        if (err)
            cb(err);
        else
            cb();
    });
};

ScoresheetEntry.statics.getTopTeamsPerEvent = function(n, id, cb) {
    return this
        .find({ tournament: id })
        .select('event scores')
        .populate('event scores.team')
        .lean()
        .exec((err, entries) => {
            if (err)
                cb(err);
            let drops = 0;
            entries.forEach(entry => {
                entry.scores.forEach(score => {
                    if (!score.rank)
                        drops++;
                });
                entry.scores.sort((a, b) => {
                    if (a.rank === 0)
                        return 1;
                    if (b.rank === 0)
                        return -1;
                    if (a.rank > b.rank)
                        return 1;
                    if (a.rank < b.rank)
                        return -1;
                    return 0;
                });
                entry.scores = entry.scores.slice(0, Math.min(n, entry.scores.length - drops, entry.scores.length));

                drops = 0;
            });

            entries.sort((a, b) => {
                return a.event.name.localeCompare(b.event.name);
            });

            cb(null, entries);
        });
};

module.exports = mongoose.model('ScoresheetEntry', ScoresheetEntry);
