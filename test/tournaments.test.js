const app = require('../app')
const mongoose = require('mongoose')
const Tournament = require('../server/models/Tournament')
const Event = require('../server/models/Event')
const User = require('../server/models/User')

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

chai.use(chaiHttp)

const baseTournament = {
	name: 'TestTournament',
	date: Date.now(),
	state: 'HI',
	city: 'Honolulu',
	joinCode: 'an-elf-on-the-shelf',
	events: []
}

const admin = {
	email: 'admin@scribe.com',
	password: 'admin',
	name: 'admin'
}

let tournament
let locals

describe('Test tournament routes', () => {
	before(done => {
		mongoose.connection.openUri(process.env.DB_TEST_URL)
		User.register(
			new User({ email: admin.email, name: admin.name }),
			admin.password,
			(err, user) => {
				// user.email.should.equal('admin@scribe.com')
				// user.name.should.equal('admin')
				done()
			}
		)
	})

	beforeEach(done => {
		tournament = new Tournament(baseTournament)
		Event.find({ inRotation: true }, (err, events) => {
			tournament.events = events.map(event => event._id)
			tournament.save((err, doc) => {
				console.log('finishing beforeEach')
				return done()
			})
		})
	})

	afterEach(() => {
		// Tournament.findByIdAndRemove(tournament._id, (err, doc) => {
		// 	console.log('finishing afterEach')
		// 	return done()
		// })
		return
	})

	after(done => {
		Tournament.remove({}, err => {
			User.remove({}, err => {
				mongoose.disconnect(done)
			})
		})
	})

	it('GET /', () => {
		chai
			.request(app)
			.get('/admin/dashboard')
			.end((err, res) => {
				console.log(res.locals)
			})
	})

	// it('GET /tournaments/:id/manage', () => {
	// 	chai.request(app)
	// 		.get('/tournaments/' + tournament._id + '/manage')
	// 		.end((err, res) => {
	// 			locals = res.locals
	// 			res.locals.should.not.equal(null)
	// 			res.should.have.status(200)
	// 		})
	// })

	// it('POST /tournaments/new', () => {
	// 	const tournamentData = baseTournament
	// 	tournamentData.name = 'New Tournament'
	// 	tournamentData.joinCode = 'a-new-join-code-here'
	// 	tournamentData.state = 'TX'

	// 	chai.request(app)
	// 		.post('/tournaments/new')
	// 		.send(tournamentData)
	// 		.end((err, res) => {
	// 			res.should.have.status(200)
	// 		})
	// })
})
