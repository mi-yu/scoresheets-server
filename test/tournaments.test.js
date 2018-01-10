
const app = require('../app')
const mongoose = require('mongoose')
const Tournament = require('../models/Tournament')

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

let tournament;

describe('Test tournament routes', () => {
	before(() => {
		mongoose.connection.openUri(process.env.DB_TEST_URL)
	})

	beforeEach(() => {
		tournament = new Tournament(baseTournament)
		return tournament.save()
	})

	afterEach(() => {
		return Tournament.findByIdAndRemove(tournament._id)
	})

	after((done) => {
		mongoose.disconnect(done)
	})

	it('it should GET tournament management page properly /tournaments/manage/:d', () => {
		chai.request(app)
			.get('/tournaments/manage/' + tournament._id)
			.end((err, res) => {
				res.should.have.status(200)
			})
	})

	it('POST /tournaments/new saves new tournament correctly', () => {
		const tournamentData = baseTournament
		tournamentData.name = 'New Tournament'
		tournamentData.joinCode = 'a-new-join-code-here'
		tournamentData.state = 'TX'

		chai.request(app)
			.post('/tournaments/new')
			.send(tournamentData)
			.end((err, res) => {
				res.should.have.status(200)
				console.log(res.body)
			})
	})
})