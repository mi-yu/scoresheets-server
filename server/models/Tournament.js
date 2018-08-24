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

Tournament.virtual('urlName').get(function () {
	return this.name.toLowerCase().split(' ').join('-')
})

// Create ScoresheetEntries after successfully creating tournament.
Tournament.pre('save', async function () {
	let eventsNeedingScoresheets = await Event.find({
		_id: {
			$in: this.events,
		},
	}).exec()

	const cTeams = await Team.find({
		tournament: this._id,
		division: 'C',
	})
		.select('_id')
		.exec()

	const bTeams = await Team.find({
		tournament: this._id,
		division: 'B',
	})
		.select('_id')
		.exec()

	const teamMapFunc = (team) => ({ team })

	ScoresheetEntry.find({
		tournament: this._id,
	})
		.populate('event')
		.exec()
		.then(entries => {
			if (entries.length) {
				eventsNeedingScoresheets = eventsNeedingScoresheets.filter(event => !entries.find(entry => entry.event.id === event.id))
			}
			const newEntries = []
			eventsNeedingScoresheets.forEach(event => {
				event.division.split('').forEach(div => {
					newEntries.push(new ScoresheetEntry({
						tournament: this._id,
						event: event._id,
						division: div,
						scores: (div === 'B' ? bTeams.map(teamMapFunc) : cTeams.map(teamMapFunc)) || [],
					}))
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
