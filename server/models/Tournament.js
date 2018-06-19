const mongoose = require('mongoose')
const { Schema } = mongoose
const Team = require('./Team')
const ScoresheetEntry = require('./ScoresheetEntry')
const Event = require('./Event')

const Tournament = new Schema({
	name: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
	date: Date,
	state: { type: String, required: true },
	city: { type: String, required: true },
	joinCode: {
		type: String,
		unique: true,
		required: true,
	} /* TODO: implement ability for users to register as specific event proctors. */,
	events: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Event',
		},
	] /* The events to be held at this tournament. */,
})

// Create ScoresheetEntries after successfully creating tournament.
Tournament.post('save', doc => {
	Event.find({ _id: { $in: doc.events } })
		.select('division name')
		.lean()
		.exec((err, events) => {
			if (err) console.log(err)

			// Create one ScoresheetEntry for each event in the tournament.
			// Populate each entry's initial tournament, event, and division information.
			const entries = []
			events.forEach(event => {
				event.division.split('').forEach(div => {
					entries.push({
						tournament: doc._id,
						event: event._id,
						division: div,
					})
				})
			})

			// Save ScoresheetEntries.
			return ScoresheetEntry.insertMany(entries)
		})
})

// Remove all scoresheet entries that reference deleted tournament.
Tournament.post('remove', doc => {
	console.log(`removing all scoresheets with tournament id ${doc._id}`)
	return ScoresheetEntry.remove({ tournament: doc._id })
})

// Remove all teams that reference deleted tournament.
Tournament.post('remove', doc => {
	console.log(`removing all teams with tournament id ${doc._id}`)
	return Team.remove({ tournament: doc.id })
})

module.exports = mongoose.model('Tournament', Tournament)
