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

        // Tiebreaker
        for (let i = 1; i < teams.length + 1; i++) {
            const countA = countOccurrences(a.scores, i);
            const countB = countOccurrences(b.scores, i);

            if (countA > countB)
                return -1;
            if (countA < countB)
                return 1;
        }

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

function countOccurrences(arr, n) {
    let count = 0;
    arr.forEach(i => {
        if (i === n)
            count++;
    });
    return count;
}

exports.getTopTeamsPerEvent = (req, res, next) => {
    ScoresheetEntry.getTopTeamsPerEvent(4, req.params.tournamentId, req.params.division, (err, topTeamsPerEvent) => {
        if (err)
            next(err);
        res.locals.topTeamsPerEvent = topTeamsPerEvent;
        next();
    });
};

exports.getTopBTeams = (req, res, next) => {
    Team.getTopTeams(4, req.params.tournamentId, 'B', (err, topTeams) => {
        if (err)
            next(err);
        res.locals.topBTeams = topTeams;
        next();
    });
};

exports.getTopCTeams = (req, res, next) => {
    Team.getTopTeams(4, req.params.tournamentId, 'C', (err, topTeams) => {
        if (err)
            next(err);
        res.locals.topCTeams = topTeams;
        next();
    });
};
