const Tournament = require('../models/Tournament')

module.exports = {
    needsGroup: function(group) {
        return function(req, res, next) {
            if (req.user && req.user.group === group) {
                next()
            } else {
                req.flash('error', 'Unauthorized, please contact an administrator for more information.')
                res.status(401).render('error')
            }
        }
    },
    getTournamentList: (req, res, next) => {
        Tournament.find((err, results) => {
            if (err)
                console.log(err)
            res.locals.tournaments = results
            next()
        })
    }
}