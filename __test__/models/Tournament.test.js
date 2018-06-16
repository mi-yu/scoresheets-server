const mongoose = require('mongoose')
const Tournament = require('../../server/models/Tournament')
const ScoresheetEntry = require('../../server/models/ScoresheetEntry')
const Event = require('../../server/models/Event')
const Team = require('../../server/models/Team')
const dbURL = require('../config.json').testURL

describe('test Tournament model', () => {
	beforeAll(() => {
		mongoose.Promise = global.Promise
		return mongoose.connect(
			dbURL,
			{
				useMongoClient: true
			}
		)
	})

	afterAll(done => {
		mongoose.connection.db.dropDatabase().then(() => {
			return mongoose.disconnect(done)
		})
	})

	test('Should successfully create tournament', async () => {
		const events = await Event.find({ inRotation: true })
			.select('_id')
			.exec()
		const tournamentData = {
			name: 'test tournament',
			date: Date.now(),
			state: 'TX',
			city: 'Austin',
			joinCode: 'random-string',
			events: events
		}

		const tournament = new Tournament(tournamentData)

		const savedTournament = await tournament.save()
		expect(savedTournament.events.length).toEqual(events.length)
		// const entries = await ScoresheetEntry.find({ tournament: tournament._id }).exec()
		// expect(entries.length).toEqual(expectedNumEntries)
	})

	test('Should create exactly one scoresheet entry per tournament event', async () => {
		const tournament = await Tournament.findOne({ name: 'test tournament' })
			.populate('events')
			.exec()
		const expectedNumEntries = tournament.events.reduce((accumulator, event) => {
			return accumulator + event.division.length
		}, 0)

		const entries = await ScoresheetEntry.find({ tournament: tournament._id }).exec()
		expect(entries.length).toEqual(expectedNumEntries)
	})

	test('Should successfully add teams to tournament', async () => {
		const tournament = await Tournament.findOne({ name: 'test tournament' }).exec()
		const divBTeam = new Team({
			tournament: tournament._id,
			school: 'b school',
			identifier: 'A',
			division: 'B',
			teamNumber: 1
		})
		const divCTeam = new Team({
			tournament: tournament._id,
			school: 'c school',
			identifier: 'A',
			division: 'C',
			teamNumber: 1
		})

		Team.insertMany([divBTeam, divCTeam]).then(async () => {
			const entries = await ScoresheetEntry.find({ tournament: tournament._id }).exec()
			entries.forEach(entry => {
				if (entry.division === 'B') expect(entry.scores).toContain(divBTeam._id)
				else expect(entry.scores).toContain(divCTeam._id)
			})
		})
	})
})
