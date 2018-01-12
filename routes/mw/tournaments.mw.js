const ScoresheetEntry = require('../../models/ScoresheetEntry');

exports.getScoresheetsInTournament = (req, res, next) => {
    ScoresheetEntry
        .find({ tournament: req.params.tournamentId })
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
            return -1;
        if (a.totalScore < b.totalScore)
            return 1;
        return 0;
    });

    // TODO: handle tiebreakers for sweepstakes
    teams.forEach((team, i) => {
        team.rank = i + 1;
    });

    next();
};
