const Tournament = require('../models/Tournament')
const Event = require('../models/Event')
const Team = require('../models/Team')

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
                req.flash('error', 'Could not load tournaments: ' + err)
            res.locals.tournaments = results
            next()
        })
    },
    getEventsList: (req, res, next) => {
        Event.find().sort('name').exec((err, results) => {
            if (err)
                req.flash('error', 'Could not load events: ' + err)
            res.locals.events = results
            next()
        })
    },
    getSchoolsList: (req, res, next) => {
        Team.find({}, '-_id school', (err, results) => {
            if (err)
                req.flash('error', 'Could not load schools: ' + err)
            let schools = []
            results.forEach((el) => {
                schools.push(el.school)
            })
            res.locals.schools = schools
            next()
        })
    },
    getTeamsInTournament: (req, res, next) => {
        Team.find({tournament: req.params.id}, (err, results) => {
            if (err)
                req.flash('error', 'Could not load teams: ' + err)
            res.locals.teams = results
            next()
        })
    }
}