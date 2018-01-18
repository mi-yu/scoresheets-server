const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');
const helpers = require('./helpers');

router.get('/dashboard', helpers.needsGroup('admin'), helpers.getTournamentList, helpers.getCurrentEventsList, function(
    req,
    res,
    next
) {
    res.json(res.locals)
});

module.exports = router;
