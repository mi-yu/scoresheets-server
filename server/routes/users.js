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
    return passport.authenticate('local-login', (err, token, userData) => {
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
    return passport.authenticate('local-register', (err) => {
        if (err) {
            console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Check form for errors',
                    errors: {
                        email: 'This email is already taken.'
                    }
                })
            }

            return res.status(400).json({
                success: false,
                message: err
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Registration successful!'
        })
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
