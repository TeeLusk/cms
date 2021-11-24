const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
	maxDocumentId: {type: Number, required: false},
	maxMessageId: {type: Number, required: false},
	maxContactId: {type: Number, required: false}
});

module.exports = mongoose.model('Sequence', sequenceSchema);
