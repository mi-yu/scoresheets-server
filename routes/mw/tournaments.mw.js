const ScoresheetEntry = require('../../models/ScoresheetEntry');
const Team = require('../../models/Team');

exports.getScoresheetsInTournament = (req, res, next) => {
    ScoresheetEntry
        .find({ tournament: req.params.tournamentId, division: req.params.division })
        .populate('tournament scores.team')
        .populate({ path: 'event', select: 'name' })
        .exec((err, entries) => {
            if (err)
                console.log(err);

            // Sort entries by event name
            entries.sort((a, b) => {
                return a.event.name.localeCompare(b.event.name);
            });

            // Sort scores by team number
            entries.forEach(entry => {
                entry.scores.sort((a, b) => {
                    if (a.team.teamNumber > b.team.teamNumber)
                        return 1;
                    if (a.team.teamNumber < b.team.teamNumber)
                        return -1;
                    return 0;
                });
            });

            res.locals.entries = entries;
            next();
        });
};

exports.populateTotalsAndRankTeams = (req, res, next) => {
    // Append score data to each team
    let teams = res.locals.teams;
    let entries = res.locals.entries;

    teams.forEach((team, i) => {
        team.scores = [];
        team.totalScore = 0;
        entries.forEach(entry => {
            team.scores.push(entry.scores[i].rank || 0);
            team.totalScore += entry.scores[i].rank || 0;
        });
    });

    teams.sort((a, b) => {
        if (a.totalScore > b.totalScore)
            return 1;
        if (a.totalScore < b.totalScore)
            return -1;
        return 0;
    });

    // TODO: handle tiebreakers for sweepstakes
    teams.forEach((team, i) => {
        team.rank = i + 1;
        Team.findByIdAndUpdate(team._id, { $set: { totalScore: team.totalScore, rank: team.rank } }, (err, updated) => {
            if (err)
                console.log(err);
        });
    });

    next();
};

exports.getTopTeamsPerEvent = (req, res, next) => {
    ScoresheetEntry.getTopTeamsPerEvent(4, req.params.tournamentId, req.params.division, (err, topTeamsPerEvent) => {
        if (err)
            next(err);
        res.locals.topTeamsPerEvent = topTeamsPerEvent;
        next();
    });
};

exports.getTopTeams = (req, res, next) => {
    Team.getTopTeams(4, req.params.tournamentId, req.params.division, (err, topTeams) => {
        if (err)
            next(err);
        res.locals.topTeams = topTeams;
        next();
    });
};
