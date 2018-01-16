const router = require('express').Router();
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Event = require('../models/Event');
const Team = require('../models/Team');
const ScoresheetEntry = require('../models/ScoresheetEntry');
const randomWords = require('random-words');
const helpers = require('./helpers');
const needsGroup = helpers.needsGroup;
const getCurrentEventsList = helpers.getCurrentEventsList;
const getSchoolsList = helpers.getSchoolsList;
const getTeamsInTournamentByDivision = helpers.getTeamsInTournamentByDivision;
const getAllTeamsInTournament = helpers.getAllTeamsInTournament;
const mw = require('./mw/tournaments.mw.js');

/* GET users listing. */
router.post('/new', needsGroup('admin'), (req, res, next) => {
    let date = new Date(req.body.date);
    date = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    const tournament = new Tournament({
        name: req.body.name,
        date: date,
        state: req.body.state,
        city: req.body.city,
        joinCode: randomWords({ exactly: 5, join: '-' }),
        events: req.body.events
    });

    tournament.save(err => {
        if (err && err.code === 11000) {
            req.flash('error', 'A tournament named "' + tournament.name + '" already exists.');
            res.redirect('/admin/dashboard');
        } else if (err) {
            req.flash('error', 'An unknown error occurred: ' + err);
            res.redirect('/admin/dashboard');
        } else {
            req.flash('success', 'Successfully created tournament "' + tournament.name + '"');
            res.redirect('/admin/dashboard');
        }
    });
});

router.get('/:id/delete', needsGroup('admin'), (req, res, next) => {
    Tournament.findById(req.params.id, (err, result) => {
        if (err)
            req.flash('error', 'The requested tournament could not be found.');
        res.render('tournaments/delete', { 'tournament': result });
    });
});

router.post('/:id/delete', needsGroup('admin'), (req, res, next) => {
    Tournament.findByIdAndRemove(req.params.id, (err, deleted) => {
        deleted.remove();
        if (err)
            req.flash('error', 'The requested tournament could not be deleted.');
        else if (deleted)
            req.flash('success', 'Successfully deleted tournament ' + deleted.name);

        res.redirect('/admin/dashboard');
    });
});

router.get('/:tournamentId/manage', needsGroup('admin'), getCurrentEventsList, getSchoolsList, getAllTeamsInTournament, (
    req,
    res,
    next
) =>
    {
        Tournament.findById(req.params.tournamentId).populate('events').exec((err, result) => {
            if (err) {
                req.flash('error', 'The requested tournament could not be found.');
                next();
            } else {
                result.events.sort((a, b) => {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                });
                res.render('tournaments/manage', { tournament: result, action: '/tournaments/' + result._id + '/edit' });
            }
        });
    });

router.post('/:id/edit', needsGroup('admin'), (req, res, next) => {
    Tournament.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                name: req.body.name,
                date: req.body.date,
                state: req.body.state,
                city: req.body.city,
                events: req.body.events
            }
        },
        (err, updated) => {
            if (err)
                req.flash('error', 'There was an error updating the tournament details: ' + err);
            else
                req.flash('success', 'Successfully updated tournament ' + updated.name);
            res.redirect('/tournaments/' + req.params.id + '/manage');
        }
    );
});

router.post(
    '/:id/edit/addTeam',
    needsGroup('admin'),
    (req, res, next) => {
        const team = new Team({
            tournament: req.params.id,
            school: req.body.school,
            teamNumber: req.body.teamNumber,
            division: req.body.division
        });

        Team.findOne({ tournament: req.params.id, teamNumber: req.body.teamNumber, division: req.body.division }, (
            err,
            result
        ) =>
            {
                if (err) {
                    req.flash('error', 'An unknown error occurred: ' + err);
                    res.redirect('/tournaments/' + req.params.id + '/manage');
                } else if (result) {
                    req.flash('error', 'A team with team number ' + req.body.teamNumber + ' already exists.');
                    res.redirect('/tournaments/' + req.params.id + '/manage');
                } else {
                    team.save(err => {
                        if (err)
                            req.error = err;
                        else {
                            req.flash(
                                'success',
                                'Successfully created team ' + team.teamNumber + ' (' + team.school + ').'
                            );
                            res.locals.addedTeam = team;
                        }
                        next();
                    });
                }
            });
    },
    (req, res) => {
        if (req.error) {
            req.flash('error', req.error.message);
            res.redirect('/tournaments/' + req.params.id + '/manage');
        } else {
            ScoresheetEntry.update(
                { tournament: req.params.id, division: res.locals.addedTeam.division },
                { $push: { scores: { team: res.locals.addedTeam._id } } },
                { multi: true },
                err => {
                    if (err)
                        req.flash('error', 'An unknown error occurred: ' + err);
                    res.redirect('/tournaments/' + req.params.id + '/manage');
                }
            );
        }
    }
);

router.get('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
    Team
        .findOne({
            tournament: req.params.tournamentId,
            teamNumber: req.params.teamNumber,
            division: req.params.division
        })
        .populate('tournament')
        .exec((err, result) => {
            if (err)
                req.flash('error', 'An unknown error occurred: ' + err);
            res.locals.team = result;
            res.render('teams/delete');
        });
});

router.post('/:tournamentId/edit/:division/deleteTeam/:teamNumber', (req, res, next) => {
    Team.findOne(
        { tournament: req.params.tournamentId, teamNumber: req.params.teamNumber, division: req.params.division },
        (err, result) => {
            result.remove();
            if (err)
                req.flash('error', 'Unable to find team ' + req.params.teamNumber + ': ' + err);
            else
                req.flash('success', 'Successfully deleted team ' + req.params.division + req.params.teamNumber)
            res.redirect('/tournaments/' + req.params.tournamentId + '/manage');
        }
    );
});

router.post('/:tournamentId/edit/:division/editTeam/:teamNumber', (req, res, next) => {
    Team.findOne(
        { tournament: req.params.tournamentId, teamNumber: req.params.teamNumber, division: req.params.division },
        (err, result) => {
            if (err) {
                req.flash('error', 'Unable to find team ' + req.params.teamNumber + ': ' + err);
                next();
            }
            result.teamNumber = req.body.teamNumber;
            result.school = req.body.school;
            result.save(err => {
                if (err)
                    req.flash('error', 'There was an error saving team ' + result.teamNumber + ': ' + err);
                else
                    req.flash('success', 'Successfully updated team ' + result.teamNumber);
                res.redirect('/tournaments/' + req.params.tournamentId + '/manage');
            });
        }
    );
});

router.get(
    '/:tournamentId/:division/results',
    getTeamsInTournamentByDivision,
    mw.getScoresheetsInTournament,
    mw.populateTotalsAndRankTeams,
    (req, res, next) => {
        res.locals.division = req.params.division
        res.render('tournaments/results');
    }
);

//TODO: variable top ranks
router.get('/:tournamentId/:division/slideshow', mw.getTopTeamsPerEvent, mw.getTopTeams, (req, res, next) => {
    res.render('tournaments/slideshow');
});

module.exports = router;
