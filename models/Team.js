const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ScoresheetEntry = require('./ScoresheetEntry'),
	ObjectId = mongoose.Types.ObjectId

const Team = new Schema({
	tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true },
	school: String,
	teamNumber: { type: String, required: true },
	score: Number,
	placing: Number
})

/*----------  need to fix this block  ----------*/

// Remove all scoresheet entries that reference deleted team.
Team.post('remove', (doc) => {
    console.log('removing all scoresheet entries with team id ' + doc._id)
    ScoresheetEntry.update({},
    	{$pull : {scores: {team: doc._id}}}, 
    	{multi: true}, 
    	(err, affected) => {
    	if (err)
    		console.log(err.message)
    	console.log(affected)
    })
})

module.exports = mongoose.model('Team', Team)