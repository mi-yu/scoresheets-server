const mongoose = require('mongoose'), Schema = mongoose.Schema;

const Event = new Schema({
    name: { type: String, unique: true },
    category: { type: String, required: true, default: 'none' },
    division: { type: String, required: true, enum: ['B', 'C', 'BC'] },
    inRotation: { type: Boolean, default: false },
    building: { type: Boolean, default: false },
    impound: { type: Boolean, default: false },
    stateEvent: { type: Boolean, default: false },
    topics: [ String ],
    currentTopic: String,
    notes: String,
    highScoreWins: { type: Boolean, default: true }
});

module.exports = mongoose.model('Event', Event);
