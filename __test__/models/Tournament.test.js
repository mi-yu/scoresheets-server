import Tournament from '../../server/models/Tournament'
import ScoresheetEntry from '../../server/models/ScoresheetEntry'
import Event from '../../server/models/Event'
import Team from '../../server/models/Team'

describe('test Tournament model', () => {
	test('Should successfully create tournament', async () => {
		const events = await Event.find({
			inRotation: true,
		})
			.select('_id')
			.exec()
		const tournament = new Tournament({
			name: 'test tournament',
			date: Date.now(),
			state: 'TX',
			city: 'Austin',
			joinCode: 'random-string',
			events,
		})

		const savedTournament = await tournament.save()
		expect(savedTournament.events.length).toEqual(events.length)
	})

	test('Should successfully add teams to tournament', async () => {
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		}).exec()
		const divBTeam = new Team({
			tournament: tournament._id,
			school: 'b school',
			identifier: 'A',
			division: 'B',
			teamNumber: 1,
		})
		const divCTeam = new Team({
			tournament: tournament._id,
			school: 'c school',
			identifier: 'A',
			division: 'C',
			teamNumber: 1,
		})

		const teams = await Team.insertMany([divBTeam, divCTeam])
		expect(teams.length).toEqual(2)
	})

	test('Should create exactly one scoresheet entry per tournament event', async () => {
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		})
			.populate('events')
			.exec()
		const expectedNumEntries = tournament.events.reduce(
			(accumulator, event) => accumulator + event.division.length,
			0,
		)

		const entries = await ScoresheetEntry.find({
			tournament: tournament.id,
		}).exec()
		expect(entries.length).toEqual(expectedNumEntries)
	})

	// TODO: write this test once seed data gets fixed

	// test('Should successfully add another event to tournament', async () => {
	// 	const extraEvent = await Event.find({
	// 		inRotation: false,
	// 	}).exec()

	// 	console.log(extraEvent)

	// 	const updatedTournament = await Tournament.findOne({
	// 		name: 'test tournament',
	// 	})
	// 		.exec()
	// 		.then(tournament => {
	// 			tournament.events.push(extraEvent._id)
	// 			return tournament.save()
	// 		})

	// 	const entry = await ScoresheetEntry.find({
	// 		tournament: updatedTournament._id,
	// 		event: extraEvent._id,
	// 	}).exec()

	// 	expect(entry).not.toBeNull()
	// 	expect(entry.length).toEqual(1)
	// 	expect(entry.event).toEqual(extraEvent._id)
	// 	expect(entry.division).toEqual('B')
	// })

	test('ScoresheetEntries should have been updated', async () => {
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		}).exec()
		const divBTeam = await Team.findOne({
			school: 'b school',
		}).exec()
		const divCTeam = await Team.findOne({
			school: 'c school',
		}).exec()
		const entries = await ScoresheetEntry.find({
			tournament: tournament._id,
		}).exec()
		entries.forEach(entry => {
			expect(entry.scores.length).toEqual(1)
			if (entry.division === 'B') {
				expect(entry.scores[0]).toHaveProperty('team', divBTeam._id)
			} else expect(entry.scores[0]).toHaveProperty('team', divCTeam._id)
		})
	})

	test('Should not allow another team with same team number/division to be added', async () => {
		expect.assertions(1)
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		}).exec()
		const anotherTeam = new Team({
			tournament: tournament._id,
			school: 'another school',
			identifier: 'B',
			division: 'B',
			teamNumber: 1,
		})

		try {
			await anotherTeam.save()
		} catch (err) {
			expect(err.code).toEqual(11000)
		}
	})

	test('Removing team should remove team from ScoresheetEntries', async () => {
		const toBeDeletedTeam = await Team.findOne({
			school: 'c school',
		}).exec()
		await toBeDeletedTeam.remove()
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		}).exec()
		const entries = await ScoresheetEntry.find({
			tournament: tournament._id,
		}).exec()

		entries.forEach(entry => {
			if (entry.division === 'C') expect(entry.scores.length).toEqual(0)
			else expect(entry.scores.length).toEqual(1)
		})
	})

	test('Deleting tournament should delete associated ScoresheetEntries/Teams', async () => {
		const tournament = await Tournament.findOne({
			name: 'test tournament',
		}).exec()
		const tournamentId = tournament._id
		await tournament.remove()

		const teams = await Team.find({
			tournament: tournamentId,
		}).exec()
		expect(teams.length).toEqual(0)

		const entries = await ScoresheetEntry.find({
			tournament: tournamentId,
		}).exec()
		expect(entries.length).toEqual(0)
	})
})
