const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
	id: {type: String, requred: true},
	name: {type: String, required: true},
	url: {type: String},
	description: {type: String},
	children: [{type: mongoose.Schema.Types.Document}]
});

module.exports = mongoose.model('Document', documentSchema);
