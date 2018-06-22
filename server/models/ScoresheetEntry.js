import mongoose from 'mongoose'
import Event from './Event'

/**
 * Each ScoresheetEntry has its own array of Scores, which
 * are not their own collection but just a way to keep the
 * main ScoresheetEntry schema from becoming unreadable.
 * @type {Schema}
 */
const Score = new mongoose.Schema({
	team: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Team',
		required: true,
	} /* The team that this score is associated with. */,
	rawScore: {
		type: Number,
		required: true,
		default: 0,
	},
	tiebreaker: {
		type: Number,
		default: 0,
	},
	tier: {
		type: Number,
		default: 1,
		required: true,
	},
	dq: {
		type: Boolean,
		default: false,
	} /* Disqualification flag. */,
	noShow: {
		type: Boolean,
		default: false,
	},
	participationOnly: {
		type: Boolean,
		default: false,
	},
	dropped: {
		type: Boolean,
		default: false,
	} /* If this score was dropped, a rank of 0 will be assigned. */,
	rank: Number /* Calculation triggered by user. */,
	notes: String /* Any special notes about the score (how a tiebreaker was won, reason for DQ, etc). */,
})

const ScoresheetEntry = new mongoose.Schema({
	tournament: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tournament',
		required: true,
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true,
	},
	division: {
		type: String,
		required: true,
		enum: ['B', 'C'],
	},
	scores: [Score],
	maxScore: Number,
	locked: {
		type: Boolean,
		default: false,
	},
})

/**
 * Calculate and assign ranks to each score in the ScoresheetEntry.
 * @param  {Function} callback handler which takes 1 optional error argument
 */
ScoresheetEntry.methods.rank = function (callback) {
	const {
		scores,
	} = this
	if (!scores.length) return callback()
	Event.findById(this.event).exec((err, event) => {
		// Save our unbroken ties (if they exist) for error handling.
		const unbrokenTies = {
			t1: {},
			t2: {},
		}

		try {
			// Sort the scores.
			scores.sort((s1, s2) => {
				if (s1.dropped > s2.dropped || (s1.dropped && s2.dropped)) return 1
				if (s1.dropped < s2.dropped) return -1
				if (s1.dq > s2.dq || (s1.dq && s2.dq)) return 1
				if (s1.dq < s2.dq) return -1
				if (s1.noShow > s2.noShow || (s1.noShow && s2.noShow)) return 1
				if (s1.noShow < s2.noShow) return -1
				if (s1.participationOnly > s2.participationOnly) return 1
				if (s1.participationOnly < s2.participationOnly) return -1
				if (s1.tier > s2.tier) return 1
				if (s1.tier < s2.tier) return -1
				if (s1.rawScore > s2.rawScore) return event.highScoreWins ? -1 : 1
				if (s1.rawScore < s2.rawScore) return event.highScoreWins ? 1 : -1
				if (s1.rawScore === s2.rawScore && s1.tiebreaker < s2.tiebreaker) return 1
				if (s1.rawScore === s2.rawScore && s1.tiebreaker > s2.tiebreaker) return -1

				// If we reach here, we have an unbroken tie.
				unbrokenTies.t1 = s1.team
				unbrokenTies.t2 = s2.team
				throw new Error(
					`Tie must be broken between ${s1.team.school} (${s1.team.division +
						s1.team.teamNumber}) and ${s2.team.school} (${s2.team.division +
						s2.team.teamNumber})`,
				)
			})
		} catch (e) {
			// When encountering unbroken ties, immediately return to callback.
			e.unbrokenTies = unbrokenTies
			return callback(e)
		}

		// Assign ranks to scores.
		scores.forEach((score, i) => {
			// If there is nothing special about the score, just give regular rank.
			if (!score.dq && !score.noShow && !score.participationOnly && !score.dropped) {
				score.rank = i + 1
			} else {
				// Otherwise, we need to handle special cases accordingly.
				if (score.participationOnly) score.rank = scores.length
				if (score.dq) score.rank = scores.length + 2
				if (score.noShow) score.rank = scores.length + 1
				if (score.dropped) score.rank = 0
			}
		})

		// Save and return to callback.
		return this.save(e => {
			if (e) callback(e)
			else callback()
		})
	})
}

/**
 * Get the top n teams in ScoresheetEntry event (for awards presentation).
 * @param  {Number}   n        number of teams to receive awards (default: 4)
 * @param  {String}   id       tournament ObjectId
 * @param  {String}   d        division (default: /(B|C)/)
 * @param  {Function} callback handler which takes 1 optional error argument
 */
ScoresheetEntry.statics.getTopTeamsPerEvent = function (n = 4, id, d = /(B|C)/, callback) {
	// Get all ScoresheetEntries for given tournament and arrange the data.
	// The .lean() gives us raw JS arrays to work with instead of Mongoose's
	// default wrapped objects.
	return this.find({
		tournament: id,
		division: d,
	})
		.select('event scores division')
		.populate('event scores.team scores')
		.lean()
		.exec((err, entries) => {
			if (err) callback(err)

			// We need to count the drops so we can exclude them from the
			// awards presentation.
			let drops = 0
			entries.forEach(entry => {
				entry.scores.forEach(score => {
					if (!score.rank ||
						score.dq ||
						score.participationOnly ||
						score.noShow ||
						score.dropped
					) {
						drops += 1
					}
				})

				// Sort the scores, moving the dropped events (zeroes) to end of array.
				entry.scores.sort((a, b) => {
					if (a.rank === 0) return 1
					if (b.rank === 0) return -1
					if (a.rank > b.rank) return 1
					if (a.rank < b.rank) return -1
					return 0
				})

				// Take at most the top n scores, throwing out drops.
				entry.scores = entry.scores.slice(
					0,
					Math.min(n, entry.scores.length - drops, entry.scores.length),
				)

				// Reset drops counter.
				drops = 0
			})

			// Sort entries by event name alphabetically.
			entries.sort((a, b) => a.event.name.localeCompare(b.event.name))

			// Order B events before C events
			const sortedEntries = []

			let b = 0
			let c = 0
			while (sortedEntries.length < entries.length) {
				while (entries[b] && entries[b].division !== 'B') b += 1
				if (b < entries.length) {
					sortedEntries.push(entries[b])
					b += 1
				}

				while (entries[c] && entries[c].division !== 'C') c += 1
				if (c < entries.length) {
					sortedEntries.push(entries[c])
					c += 1
				}
			}

			return callback(null, sortedEntries)
		})
}

export default mongoose.model('ScoresheetEntry', ScoresheetEntry)
