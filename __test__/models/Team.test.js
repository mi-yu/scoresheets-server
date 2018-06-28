import mongoose from 'mongoose'
import Team from '../../server/models/Team'

describe('test Team model', () => {
	const tournamentId = mongoose.Types.ObjectId()
	const teams = [
		new Team({
			tournament: tournamentId,
			school: 'duplicate school',
			identifier: 'A',
			division: 'B',
			teamNumber: 1,
			rank: 1,
		}),
		new Team({
			tournament: tournamentId,
			school: 'duplicate school',
			identifier: 'B',
			division: 'B',
			teamNumber: 3,
			rank: 3,
		}),
		new Team({
			tournament: tournamentId,
			school: 'school 2',
			teamNumber: 2,
			division: 'B',
			rank: 2,
		}),
		new Team({
			tournament: tournamentId,
			school: 'school 3',
			teamNumber: 4,
			division: 'B',
			rank: 4,
		}),
		new Team({
			tournament: tournamentId,
			school: 'school 4',
			teamNumber: 5,
			division: 'B',
			rank: 5,
		}),
	]

	it('should insert teams succesfully', async () => {
		// Use a random ObjectId here since we don't actually need a real Tournament
		const inserted = await Team.insertMany(teams)
		expect(inserted.length).toEqual(5)
	})

	it('should get top teams for sweepstakes correctly', done => {
		Team.getTopTeams(3, tournamentId, 'B', (err, finalTeams) => {
			expect(err).toBeNull()
			expect(finalTeams.length).toEqual(3)
			expect(finalTeams[0]._id).toEqual(teams[0]._id)
			expect(finalTeams[1]._id).toEqual(teams[2]._id)
			expect(finalTeams[2]._id).toEqual(teams[3]._id)
			done()
		})
	})
})
