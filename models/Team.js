const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ScoresheetEntry = require('./ScoresheetEntry'),
    ObjectId = mongoose.Types.ObjectId;

const divisionValidator = [ val => /^(B|C)$/.test(val), 'Division must be either B or C.' ];

const Team = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    school: String,
    division: { type: String, required: true, enum: ['B', 'C'] },
    teamNumber: { type: Number, required: true, min: 1 },
    totalScore: Number,
    rank: Number
});

Team.post('remove', doc => {
    console.log('removing all scoresheet entries with team id ' + doc._id);
    ScoresheetEntry.update({}, { $pull: { scores: { team: doc._id } } }, { multi: true }, (err, affected) => {
        if (err)
            console.log(err.message);
        console.log(affected);
    });
});

Team.statics.getTopTeams = function(n, id, d, cb) {
    let regex;
    if (!d)
        regex = /(B|C)/
    else
        regex = d
    return this.find({ tournament: id, division: regex}).sort('rank').limit(n).exec((err, teams) => {
        if (err)
            cb(err);
        else
            cb(null, teams);
    });
};

module.exports = mongoose.model('Team', Team);
