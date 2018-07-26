import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../server/app'
import Tournament from '../../server/models/Tournament'
import Team from '../../server/models/Team'
import { TEST_URL } from '../config'

jest.mock('../../server/passport/auth', () => ({
	ensureAuthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	permitUnauthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	needsGroup: jest.fn().mockImplementation(() => (req, res, next) => next()),
}))

describe('Teams API Tests', () => {
	let testTournament

	beforeAll(async () => {
		await mongoose.connect(TEST_URL)
		testTournament = await Tournament.create({
			name: 'test tournament for teams',
			date: Date.now(),
			state: 'TX',
			city: 'Austin',
			joinCode: 'random string',
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await app.close()
	})

	describe('GET /tournaments/:tournamentId/teams', () => {
		test('Returns an empty list of teams for a new tournament', async () => {
			const response = await request(app).get(`/tournaments/${testTournament.id}/teams`)
			expect(response.statusCode).toBe(200)
			expect(response.body.length).toBe(0)
		})
	})

	describe('POST /tournaments/:tournamentId/teams', () => {
		let url

		beforeAll(() => {
			url = `/tournaments/${testTournament.id}/teams`
		})

		afterEach(async () => {
			await Team.deleteMany().exec()
		})

		test('Successfully creates a single team', async () => {
			const testTeam = {
				school: 'test school',
				division: 'B',
				teamNumber: 1,
				tournament: testTournament.id,
			}
			const response = await request(app)
				.post(url)
				.send(testTeam)

			expect(response.statusCode).toBe(201)
			expect(response.body.length).toBe(1)

			const returnedTournament = response.body[0]
			expect(returnedTournament).toHaveProperty('school', 'test school')
			expect(returnedTournament).toHaveProperty('tournament', testTournament.id)
		})

		test('Successfully creates multiple teams at once', async () => {
			const teams = [
				{
					school: 'test school 1',
					division: 'B',
					teamNumber: 1,
					tournament: testTournament.id,
				},
				{
					school: 'test school 2',
					division: 'C',
					teamNumber: 1,
					tournament: testTournament.id,
				},
			]

			const response = await request(app)
				.post(url)
				.send(teams)

			expect(response.statusCode).toBe(201)
			expect(response.body.length).toBe(2)
		})

		test('Errors when creating with missing/bad params', async () => {
			const badTeam = {
				school: null,
				tournament: null,
				division: 'D',
				teamNumber: 1,
			}

			const response = await request(app)
				.post(url)
				.send(badTeam)

			expect(response.statusCode).toBe(400)
			expect(response.body).toHaveProperty('errors')
		})
	})
})
