const mongoose = require('mongoose')
const User = require('../../server/models/User')
const dbURL = require('../config.json').testURL

describe('test User model', () => {
	beforeAll(() => {
		mongoose.Promise = global.Promise
		return mongoose.connect(
			dbURL,
			{
				useMongoClient: true
			}
		)
	})

	afterAll(async done => {
		await mongoose.connection.db.dropDatabase()
		return mongoose.disconnect(done)
	})

	test('Should register user when given valid params', async () => {
		const newUser = new User({
			firstName: 'first',
			lastName: 'last',
			email: 'email@test.com',
			password: 'test123',
			group: 'user'
		})

		await newUser.save()
		console.log('saved')
		const user = await User.findOne({ email: 'email@test.com' })
		expect(user.firstName).toEqual('first')
		expect(user.group).toEqual('user')
		user.comparePassword('test123', (err, isMatch) => {
			expect(err).toBeUndefined()
			expect(isMatch).toBe(true)
		})
	})
})
