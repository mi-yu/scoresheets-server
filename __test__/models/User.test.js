import mongoose from 'mongoose'
import User from '../../server/models/User'
import { TEST_URL } from '../config'

describe('test User model', () => {
	beforeAll(async () => {
		await mongoose.connect(TEST_URL)
	})

	afterAll(async () => {
		await mongoose.disconnect()
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
		const user = await User.findOne({
			email: 'email@test.com',
		})
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

		const users = await User.find({
			email: 'email@test.com',
		})
		expect(users.length).toEqual(1)
	})
})
