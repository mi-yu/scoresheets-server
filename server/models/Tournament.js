/* eslint-disable prefer-arrow-callback */

import mongoose from 'mongoose'
import Event from './Event'
import ScoresheetEntry from './ScoresheetEntry'
import Team from './Team'

const Tournament = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		trim: true,
		required: true,
	},
	date: Date,
	state: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: true,
	},
	joinCode: {
		type: String,
		unique: true,
		required: true,
	} /* TODO: implement ability for users to register as specific event proctors. */,
	events: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Event',
		},
	] /* The events to be held at this tournament. */,
	directors: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	],
})

// Create ScoresheetEntries after successfully creating tournament.
Tournament.pre('save', async function() {
	let eventsNeedingScoresheets = await Event.find({
		_id: {
			$in: this.events,
		},
	}).exec()

	ScoresheetEntry.find({
		tournament: this._id,
	})
		.populate('event')
		.exec()
		.then(entries => {
			if (entries.length) {
				eventsNeedingScoresheets = this.events.filter(event => {
					const entryExists = entries.filter(entry => entry.event._id === event._id)
					return !entryExists
				})
			}
			const newEntries = []
			eventsNeedingScoresheets.forEach(event => {
				event.division.split('').forEach(div => {
					newEntries.push({
						tournament: this._id,
						event: event._id,
						division: div,
					})
				})
			})
			return ScoresheetEntry.insertMany(newEntries)
		})
})

// Remove all scoresheet entries that reference deleted tournament.
Tournament.post('remove', doc => {
	console.log(`removing all scoresheets with tournament id ${doc._id}`)
	return ScoresheetEntry.remove({
		tournament: doc._id,
	})
})

// Remove all teams that reference deleted tournament.
Tournament.post('remove', doc => {
	console.log(`removing all teams with tournament id ${doc._id}`)
	return Team.remove({
		tournament: doc.id,
	})
})

export default mongoose.model('Tournament', Tournament)
