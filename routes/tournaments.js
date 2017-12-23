const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const passport = require('passport');
const randomWords = require('random-words');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect('/users/me')
});

router.post('/new', function(req, res, next) {
	const tournament = new Tournament({
		name: req.body.name,
		date: req.body.date,
		joinCode: randomWords({exactly: 5, join: '-'})
	});

	tournament.save((err) => {
		if (err)
			console.log(err);
	});

	res.send(JSON.stringify(tournament));
})

module.exports = router;
