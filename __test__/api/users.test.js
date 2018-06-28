import request from 'supertest'
import app from '../../server/app'

describe('GET /users', () => {
	test('should return 200', async () => {
		const response = await request(app).get('/users')
		expect(response.statusCode).toBe(200)
	})
})
