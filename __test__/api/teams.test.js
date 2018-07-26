import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../server/app'
import Tournament from '../../server/models/Tournament'
import { TEST_URL } from '../config'

jest.mock('../../server/passport/auth', () => ({
	ensureAuthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	permitUnauthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	needsGroup: jest.fn().mockImplementation(() => (req, res, next) => next()),
}))

describe('GET /users', () => {
	let tournament

	beforeAll(async () => {
		await mongoose.connect(TEST_URL)
		tournament = await Tournament.create({
			name: 'test tournament',
			date: Date.now(),
			state: 'TX',
			city: 'Austin',
			joinCode: 'random string'
		})
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await app.close()
	})

	test('Returns an empty list of teams for a new tournament', async () => {
		const response = await request(app).get(`/tournaments/${tournament._id}/teams`)
		expect(response.statusCode).toBe(200)
		expect(response.body.length).toBe(0)
	})

	test('Can successfully create a single team', async () => {
		const testTeam = {
			school: 'test school',
			division: 'B',
			teamNumber: 1,
			tournament: tournament._id,
		}
		const response = await request(app)
			.post(`/tournaments/${tournament._id}/teams`)
			.send(testTeam)

		expect(response.statusCode).toBe(201)
		expect(response.body.length).toBe(1)
		expect(response.body[0].school).toBe('test school')
	})
})
