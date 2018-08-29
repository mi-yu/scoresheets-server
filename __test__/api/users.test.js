import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../server/app'
import { TEST_URL } from '../config'
import { ensureAuthenticated, needsGroup } from '../../server/passport/auth'
import { UnauthorizedError, ForbiddenError } from '../../server/errors'
import users from '../seeds/users.seed.json'

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

	it('should return 200 when authenticated and user is admin', async () => {
		const response = await request(app).get('/users')

		expect(response.statusCode).toBe(200)
		expect(response.body.sort((a, b) => a.email.localCompare(b.email))).toMatchObject(users)
	})

	it('should return 403 when authenticated and user is not admin', async () => {
		needsGroup.mockImplementation(() => (req, res, next) => next(new ForbiddenError()))
		const response = await request(app).get('/users')
		expect(response.statusCode).toBe(200)
	})

	it('should return 401 when unauthenticated', async () => {
		ensureAuthenticated.mockImplementation((req, res, next) => next(new UnauthorizedError()))
		const response = await request(app).get('/users')
		expect(response.statusCode).toBe(401)
	})
})
