const Tournament = require('../models/Tournament');
const Event = require('../models/Event');
const Team = require('../models/Team');

module.exports = {
    needsGroup: group => {
        return (req, res, next) => {
            if (
                req.user && req.user.group === group || process.env.NODE_ENV == 'development' ||
                    process.env.NODE_ENV == 'test'
            ) {
                next();
            } else {
                req.flash('error', 'Unauthorized, please contact an administrator for more information.');
                res.status(401).render('error');
            }
        };
    },
    getTournamentList: (req, res, next) => {
        Tournament.find((err, results) => {
            if (err)
                req.flash('error', 'Could not load tournaments: ' + err);
            res.locals.tournaments = results;
            next();
        });
    },
    getCurrentEventsList: (req, res, next) => {
        Event.find({inRotation: true}).sort('name').exec((err, results) => {
            if (err)
                req.flash('error', 'Could not load events: ' + err);
            res.locals.events = results;
            next();
        });
    },
    getSchoolsList: (req, res, next) => {
        Team.find({}, '-_id school', (err, results) => {
            if (err)
                req.flash('error', 'Could not load schools: ' + err);
            let schools = [];
            results.forEach(el => {
                schools.push(el.school);
            });
            res.locals.schools = Array.from(new Set(schools));
            next();
        });
    },
    getTeamsInTournament: (req, res, next) => {
        Team.find({ tournament: req.params.tournamentId }).lean().sort('teamNumber').exec((err, results) => {
            if (err)
                req.flash('error', 'Could not load teams: ' + err);
            res.locals.teams = results;
            next();
        });
    }
};
