const mongoose = require('mongoose')
const User = require('../../server/models/User')
const dbURL = require('../config.json').testURL

describe('test User model', () => {
	beforeAll(() => {
		mongoose.Promise = global.Promise
		return mongoose.connect(dbURL)
	})

	afterAll(done => {
		mongoose.connection.db.dropDatabase().then(() => mongoose.disconnect(done))
	})

	test('Should register user when given valid params', async () => {
		const newUser = new User({
			firstName: 'first',
			lastName: 'last',
			email: 'email@test.com',
			password: 'test123',
			group: 'user',
		})

		await newUser.save()
		const user = await User.findOne({ email: 'email@test.com' })
		expect(user.firstName).toEqual('first')
		expect(user.group).toEqual('user')
		user.comparePassword('test123', (err, isMatch) => {
			expect(err).toBeUndefined()
			expect(isMatch).toBe(true)
		})
	})

	test('Should not ensure emails are unique across users', async () => {
		const dupUser = new User({
			firstName: 'another',
			lastName: 'user',
			email: 'email@test.com',
			password: 'test123',
			group: 'user',
		})

		try {
			await dupUser.save()
		} catch (err) {
			expect(err.code).toEqual(11000)
		}

		const users = await User.find({ email: 'email@test.com' })
		expect(users.length).toEqual(1)
	})
})
