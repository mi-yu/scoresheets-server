const router = require('express').Router()
const { ensureAuthenticated, needsGroup } = require('./middleware/auth')
const { getTournamentList, getCurrentEventsList } = require('./helpers')

router.get(
	'/dashboard',
	ensureAuthenticated,
	needsGroup('admin'),
	getTournamentList,
	getCurrentEventsList,
	(req, res) => {
		res.json(res.locals)
	},
)

module.exports = router
