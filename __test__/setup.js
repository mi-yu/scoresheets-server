import mongoose from 'mongoose'
import { TEST_URL } from './config'
import eventSeedData from './seeds/Event.seed'

beforeAll(() =>
	mongoose
		.connect(TEST_URL)
		.then(() => mongoose.connection.db.collection('events').insertMany(eventSeedData)))

afterAll(done => mongoose.connection.db.dropDatabase().then(() => mongoose.disconnect(done)))
