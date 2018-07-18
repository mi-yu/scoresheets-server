import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../server/app'
import { TEST_URL } from '../config'

jest.mock('../../server/passport/auth', () => ({
	ensureAuthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	permitUnauthenticated: jest.fn().mockImplementation((req, res, next) => next()),
	needsGroup: jest.fn().mockImplementation(() => (req, res, next) => next()),
}))

describe('GET /users', () => {
	beforeAll(async () => {
		await mongoose.connect(TEST_URL)
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await app.close()
	})

	test('should return 200', async () => {
		const response = await request(app).get('/users')
		expect(response.statusCode).toBe(200)
	})
})
