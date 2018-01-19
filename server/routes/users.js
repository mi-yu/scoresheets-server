const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

/* GET users listing. */
router.get('/', (req, res, next) => {
    res.redirect('/users/me');
});

router.get('/me', (req, res, next) => {
    if (req.user.group === 'admin')
        res.json({user: req.user})
    else if (req.user)
        res.json({user: req.user})
    else
        res.redirect('/users/login');
});

router.get('/login', (req, res, next) => {
    res.render('user/login', { 'message': req.flash() });
});

router.post('/login', (req, res, next) => {
    console.log(req.body)
    passport.authenticate('local-login', (err, token, userData) => {
        if (err) {
            if (err.name === 'IncorrectCredentialsError')
                return res.status(400).json({
                    success: false,
                    message: err.message
                })

            return res.status(400).json({
                success: false,
                message: err
            })
        }

        return res.json({
            success: true,
            message: 'You have successfully logged in!',
            token,
            user: userData
        })
    })(req, res, next)
})

router.get('/register', (req, res, next) => {
    res.render('user/register');
});

router.post('/register', (req, res, next) => {
    const newUser = new User({
        email: req.body.email.trim(),
        password: req.body.password.trim(),
        name: req.body.name.trim()
    })

    newUser.save((err) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        res.json({
            success: true,
            message: 'Registration successful.'
        })
    })
})

module.exports = router;
