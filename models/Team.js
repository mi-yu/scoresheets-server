const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ScoresheetEntry = require('./ScoresheetEntry'),
    ObjectId = mongoose.Types.ObjectId;

const divisionValidator = [ val => /^(B|C)$/.test(val), 'Division must be either B or C.' ];

const Team = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
    school: String,
    division: { type: String, required: true, validate: divisionValidator },
    teamNumber: { type: Number, required: true, min: 1 },
    score: Number,
    placing: Number
});

Team.post('remove', doc => {
    console.log('removing all scoresheet entries with team id ' + doc._id);
    ScoresheetEntry.update({}, { $pull: { scores: { team: doc._id } } }, { multi: true }, (err, affected) => {
        if (err)
            console.log(err.message);
        console.log(affected);
    });
});

module.exports = mongoose.model('Team', Team);
