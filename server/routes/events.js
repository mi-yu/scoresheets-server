const router = require('express').Router();
const User = require('../models/User');
const Tournament = require('../models/Tournament');
const Event = require('../models/Event');
const needsGroup = require('./helpers').needsGroup;

router.post('/new', needsGroup('admin'), (req, res, next) => {
    const event = new Event({
        name: req.body.name,
        division: req.body.division,
        category: req.body.category,
        resources: req.body.resources,
        inRotation: req.body.inRotation,
        impound: req.body.impound,
        stateEvent: req.body.stateEvent,
        highScoreWins: req.body.highScoreWins,
        topic: req.body.currentTopic
    });

    event.save((err, doc) => {
        if (err)
            req.flash('error', err.message);
        else
            req.flash('success', 'Successfully created new event: ' + event.name);
        res.redirect('/admin/dashboard');
    });
});

router.post('/:eventId/edit', needsGroup('admin'), (req, res, next) => {
    console.log(req.body.category);
    Event.findByIdAndUpdate(
        req.params.eventId,
        {
            $set: {
                name: req.body.name,
                division: req.body.division,
                category: req.body.category,
                resources: req.body.resources,
                inRotation: req.body.inRotation,
                impound: req.body.impound,
                stateEvent: req.body.stateEvent,
                highScoreWins: req.body.highScoreWins,
                currentTopic: req.body.currentTopic
            }
        },
        (err, updated) => {
            if (err)
                req.flash('error', err.message);
            else
                req.flash('success', 'Successfully updated ' + updated.name);
            res.redirect('/admin/dashboard');
        }
    );
});

module.exports = router;
