import sinon from 'sinon'
import mongoose from 'mongoose'
import request from 'supertest'
import * as auth from '../../server/passport/auth'
import { TEST_URL } from '../config'

let sandbox
let app
let server

describe('GET /users', () => {
	beforeAll(async () => {
		await mongoose.connect(TEST_URL)
		sandbox = sinon.createSandbox()
		sandbox.stub(auth, 'ensureAuthenticated').callsFake((req, res, next) => {
			console.log('in fake')
			return next()
		})
		sandbox.stub(auth, 'needsGroup').returns((req, res, next) => next())

		app = require('../../server/app').default
		server = app.listen(9000)
	})

	afterAll(async () => {
		await mongoose.disconnect()
		await server.close()
	})

	// afterEach(() => {
	// 	sandbox.restore()
	// })

	test('should return 200', async () => {
		// console.log('hitting test')
		const response = await request(server).get('/users')
		// console.log(response)
		expect(response.statusCode).toBe(200)
	})
})
