const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ScoresheetEntry = require('./ScoresheetEntry'),
    ObjectId = mongoose.Types.ObjectId;

const divisionValidator = [ val => /^(B|C)$/.test(val), 'Division must be either B or C.' ];

const Team = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    school: String,
    division: { type: String, required: true, enum: [ 'B', 'C' ] },
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
        regex = /(B|C)/;
    else
        regex = d;
    return this.find({ tournament: id, division: regex }).sort('rank').lean().exec((err, teams) => {
        if (err)
            cb(err);
        else {
            const usedSchools = new Set();
            let finalTeams = [];

            for (let i = 0; i < teams.length; i++) {
                if (!usedSchools.has(teams[i].school)) {
                    finalTeams.push(teams[i]);
                    usedSchools.add(teams[i].school);
                }
            }

            finalTeams = finalTeams.splice(0, Math.min(finalTeams.length, n));

            cb(null, finalTeams);
        }
    });
};

module.exports = mongoose.model('Team', Team);
