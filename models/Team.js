var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Team = new keystone.List('Team');

Team.add({
	school: {
		type: String 
	},
	teamNumber: {
		type: Boolean
	},
	tournaments: {
		type: Types.Relationship,
		ref: 'Tournament',
		many: true
	}
});

Team.register();
