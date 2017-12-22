var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Event Model
 * =============
 */

var Event = new keystone.List('Event', {
	defaultSort: '-inRotation'
});

Event.add({
	name: {
		type: String 
	},
	building: {
		type: Boolean
	},
	impound: {
		type: Boolean
	},
	inRotation: {
		type: Boolean
	},
	stateEvent: {
		type: Boolean
	},
	topic: {
		type: String,
		many: true
	},
	resources: {
		type: String
	}
});

Event.defaultColumns = 'name, building, impound';
Event.register();
