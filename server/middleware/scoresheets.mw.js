import { ValidationError, ApplicationError } from '../errors';

/* eslint-disable */
export const validateScoresheet = (req, res, next) => {
	const { scores } = req.body
	if (!scores) {
		return next()
	}

	const errors = []

	for (let scoreAIndex = 0; scoreAIndex < scores.length; scoreAIndex += 1) {
		for (let scoreBIndex = scoreAIndex + 1; scoreBIndex < scores.length; scoreBIndex += 1) {
			const scoreA = scores[scoreAIndex]
			const scoreB = scores[scoreBIndex]

			if (scoreA.rawScore === scoreB.rawScore && scoreA.tiebreaker === scoreB.tiebreaker && scoreA.tier === scoreB.tier) {
				/* eslint-disable */
				const { dq: dq_a, noShow: noShow_a, participationOnly: participationOnly_a, dropped: dropped_a } = scoreA
				const { dq: dq_b, noShow: noShow_b, participationOnly: participationOnly_b, dropped: dropped_b } = scoreB

				if (
					!dq_a && !dq_b && !noShow_a && !noShow_b
					&& !participationOnly_a && !participationOnly_b
					&& !dropped_a && !dropped_b
					/* eslint-enable */
				) {
					// TODO: add better messages
					errors.push({
						scoreA,
						scoreB,
					})
				}
			}
		}
	}

	if (errors.length) return next(new ValidationError('There are unbroken ties', errors))
	return next()
}

export const whitelistParams = (...whitelist) => (req, res, next) => {
	const params = Object.keys(req.body)
	params.forEach(param => {
		if (!whitelist.includes(param)) {
			return next(new ApplicationError(`Bad request with invalid param ${param}`))
		}
	})

	return next()
}
