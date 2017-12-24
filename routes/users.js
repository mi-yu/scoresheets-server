const router = require('express').Router()
const User = require('../models/User')
const passport = require('passport')

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect('/users/me')
})

router.get('/me', function(req, res, next) {
	if (req.user)
		res.render('user/profile')
	else
		res.redirect('/users/login')
})

router.get('/login', function(req, res, next) {
	res.render('user/login', {
		'message': req.flash()
	})
})

router.post('/login',
	passport.authenticate('local', { 
		successRedirect: '/users/me',
		failureRedirect: '/users/login',
		failureFlash: true 
	})
)

router.get('/register', function(req, res, next) {
	res.render('user/register')
})

router.post('/register', function(req, res, next) {
    User.register(new User({
        email: req.body.email,
        name: req.body.name
    }), req.body.password, function(err, user) {
        if (err) {
            req.flash('error', 'Email already in use.')
        	res.redirect('/users/register')
        } else {
	        passport.authenticate('local')(req, res, function() {
	            res.redirect('/')
	        })
        }
    })
})

router.get('/logout', function(req, res, next) {
	req.logout()
	res.redirect('/')
})

module.exports = router
