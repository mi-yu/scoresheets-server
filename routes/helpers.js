const Tournament = require('../models/Tournament')
const Event = require('../models/Event')

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
                req.flash('error', 'Could not load tournaments.')
            res.locals.tournaments = results
            next()
        })
    },
    getEventsList: (req, res, next) => {
        Event.find().sort('name').exec((err, results) => {
            if (err)
                req.flash('error', 'Could not load events.')
            res.locals.events = results
            next()
        })
    }
}