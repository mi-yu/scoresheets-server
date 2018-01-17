const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Team = require('./Team'),
    ScoresheetEntry = require('./ScoresheetEntry'),
    Event = require('./Event');

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true, required: true },
    date: Date,
    state: { type: String, required: true },
    city: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    events: [ { type: Schema.Types.ObjectId, ref: 'Event' } ]
});

// Create ScoresheetEntries after successful save
Tournament.post('save', doc => {
    Event.find({ _id: { $in: doc.events } }).select('division name').lean().exec((err, events) => {
        if (err)
            console.log(err);

        let entries = [];
        events.forEach(event => {
            event.division.split('').forEach(div => {
                entries.push({ tournament: doc._id, event: event._id, division: div });
            });
        });

        ScoresheetEntry.collection.insert(entries, (err, docs) => {
            if (err)
                throw new Error(err);
            else
                console.info('%d documents inserted', docs);
        });
    });
});

// Remove all scoresheet entries that reference deleted tournament.
Tournament.post('remove', doc => {
    console.log('removing all scoresheets with tournament id ' + doc._id);
    ScoresheetEntry.remove({ tournament: doc._id }, (err, numRemoved) => {
        if (err)
            console.log(err);
        else
            console.log('removed ' + numRemoved.n + ' documents');
    });
});

// Remove all teams that reference deleted tournament.
Tournament.post('remove', doc => {
    console.log('removing all teams with tournament id ' + doc._id);
    Team.remove({ tournament: doc.id }, (err, numRemoved) => {
        if (err)
            console.log(err);
        else
            console.log('removed ' + numRemoved.n + ' documents');
    });
});

module.exports = mongoose.model('Tournament', Tournament);
