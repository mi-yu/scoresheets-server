const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ScoresheetEntry = require('./ScoresheetEntry'),
	ObjectId = mongoose.Types.ObjectId

const Team = new Schema({
	tournament: {
		type: Schema.Types.ObjectId,
		ref: 'Tournament',
		required: true
	} /* Tournament that this team belongs to. */,
	school: String,
	identifier: String /* Distinguishes between two teams from same school (team A, team B, etc)*/,
	division: {
		type: String,
		required: true,
		enum: ['B', 'C']
	} /* A team can either be in division B or C. */,
	teamNumber: {
		type: Number,
		required: true,
		min: 1
	} /* Must be unique within a tournament. */,
	totalScore: Number /* Overall team score (currently only supports lowest overall score wins). */,
	rank: Number /* Overall sweepstakes rank (calculation triggered by user). */
})

// Ensure that for a given tournament, there is only one team in each division with a given team number.
Team.index({ tournament: 1, division: 1, teamNumber: 1 }, { unique: true })

Team.post('save', team => {
	ScoresheetEntry.update(
		{ tournament: team.tournament, division: team.division },
		{ $push: { scores: { team: team._id } } },
		{ multi: true },
		err => {
			if (err)
				throw new Error(
					`Error creating scoresheet entry for team ${team.division}${team.teamNumber}`
				)
		}
	)
})

/**
 * This code runs after the removal of a Team object.
 * @param  {Team} doc            the removed team
 */
Team.post('remove', doc => {
	console.log('Removing all scoresheet entries with team id ' + doc._id + '.')

	// Remove the deleted team from all ScoresheetEntries that include this team.
	ScoresheetEntry.update(
		{
			/* TODO: optimize this query first filter for ScoresheetEntries that belong to same tournament as deleted team. */
		},
		{ $pull: { scores: { team: doc._id } } },
		{ multi: true },
		(err, affected) => {
			// TODO: better error handling.
			if (err) console.log(err.message)

			// Rerank teams to reflect removal of team.
			ScoresheetEntry.find(
				{
					tournament: doc.tournament,
					division: doc.division
				},
				(err, entries) => {
					console.log('found entries ' + entries.length)
					entries.forEach(entry =>
						entry.rank(err => {
							console.log('reranking entry ' + entry._id)
							if (err) console.log(err)
						})
					)
				}
			)
		}
	)
})

/**
 * Get the top n teams in a given division for overall sweepstakes.
 * @param  {Number}   n  number of teams
 * @param  {String}   id tournament ID to calculate sweepstakes results for
 * @param  {String}   d  division
 * @param  {Function} cb handler that returns the top n teams per division and an optional error
 */
Team.statics.getTopTeams = function(n, id, d, cb) {
	// TODO: throw error if bad regex.
	const regex = d ? d : /(B|C)/

	// Default number of awards is 4.
	n = n ? n : 4

	return this.find({
		tournament: id,
		division: regex
	})
		.sort('rank')
		.lean()
		.exec((err, teams) => {
			if (err) cb(err)
			else {
				const usedSchools = new Set()
				let finalTeams = []

				for (let i = 0; i < teams.length; i++) {
					if (!usedSchools.has(teams[i].school)) {
						finalTeams.push(teams[i])
						usedSchools.add(teams[i].school)
					}
				}

				finalTeams = finalTeams.splice(0, Math.min(finalTeams.length, n))

				cb(null, finalTeams)
			}
		})
}

module.exports = mongoose.model('Team', Team)
