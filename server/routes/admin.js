const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const helpers = require('./helpers')
const auth = require('./middleware/auth')

router.get(
	'/dashboard',
	auth.ensureAuthenticated,
	auth.needsGroup('admin'),
	helpers.getTournamentList,
	helpers.getCurrentEventsList,
	(req, res, next) => {
		res.json(res.locals)
	},
)

module.exports = router
