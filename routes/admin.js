const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const needsGroup = require('./helpers').needsGroup;

router.get('/dashboard', needsGroup('admin'), function(req, res, next) {
	res.render('admin/dashboard')
});

module.exports = router;