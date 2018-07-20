import { ValidationError } from '../errors';

/* eslint-disable */
export const validateScoresheet = (req, res, next) => {
    const { scores } = req.body
    if (!scores) {
        return next(new ValidationError({
            scores: {
                type: 'required',
            },
        }))
    }

    const errors = []

    for (let scoreAIndex = 0; scoreAIndex < scores.length; scoreAIndex += 1) {
        for (let scoreBIndex = scoreAIndex + 1; scoreBIndex < scores.length; scoreBIndex += 1) {
            const scoreA = scores[scoreAIndex]
            const scoreB = scores[scoreBIndex]

            if (scoreA.rawScore === scoreB.rawScore && scoreA.tiebreaker === scoreB.tiebreaker && scoreA.tier === scoreB.tier) {
                /* eslint-disable */
                const { dq_a, noShow_a, participationOnly_a, dropped_a } = scoreA
                const { dq_b, noShow_b, participationOnly_b, dropped_b } = scoreB

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
