import { ValidationError } from '../errors';

export const validateScoresheet = (req, res, next) => {
	const { scores } = req.body
	if (!scores) {
		return next(new ValidationError({
			scores: {
				type: 'required',
			},
		}))
	}

	for (let scoreA = 0; scoreA < scores.length; scoreA += 1) {
		for (let scoreB = scoreA + 1; scoreB < scores.length; scoreB += 1) {
			if (scoreA.rawScore === scoreB.rawScore && scoreA.tiebreaker === scoreB.tiebreaker) {
				/* eslint-disable */
                const { tier_a, dq_a, noShow_a, participationOnly_a, dropped_a } = scoreA
                const { tier_b, dq_b, noShow_b, participationOnly_b, dropped_b } = scoreB

                if (
                    !dq_a && !dq_b && !noShow_a && !noShow_b
                    && !participationOnly_a && !participationOnly_b
                    && !dropped_a && !dropped_b
                    /* eslint-enable */
				) {
					// TODO: add better messages
					return next(new ValidationError('There are unbroken ties', []))
				}
			}
		}
	}

	return next()
}
