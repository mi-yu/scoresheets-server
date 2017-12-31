const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Team = require('./Team'),
    ScoresheetEntry = require('./ScoresheetEntry')

const Tournament = new Schema({
    name: { type: String, unique: true, trim: true, required: true },
    date: Date,
    state: { type: String, required: true},
    city: { type: String, required: true },
    joinCode: { type: String, unique: true, required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
})

Tournament.post('remove', (doc) => {
    console.log('removing all scoresheets with tournament id ' + doc._id)
    ScoresheetEntry.remove({tournament: doc._id}, (err) => {
        if (err)
            console.log(err)
    })
})

Tournament.post('remove', (doc) => {
    console.log('removing all teams with tournament id ' + doc._id)
    Team.remove({tournament: doc.id}, (err) => {
        if (err)
            console.log(err)
    })
})

module.exports = mongoose.model('Tournament', Tournament)