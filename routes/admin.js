const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')
const helpers = require('./helpers')

router.get('/dashboard', 
	helpers.needsGroup('admin'), 
	helpers.getTournamentList, 
	function(req, res, next) {
		res.render('admin/dashboard')
})

module.exports = router