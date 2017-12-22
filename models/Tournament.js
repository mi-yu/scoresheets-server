var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Gallery Model
 * =============
 */

var Tournament = new keystone.List('Tournament');

Tournament.add({
	name: {
		type: String 
	},
	date: {
		type: Date
	},
	events: {
		type: Types.Relationship,
		ref: 'Event',
		many: true
	},
	teams: {
		type: Types.Relationship,
		ref: 'Team',
		many: true
	}
});

Tournament.register();
