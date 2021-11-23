var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Document = require('../models/document');

router.get('/', (req, res, next) => {
	Document.find()
});

router.post('/', (req, res, next) => {
	const maxDocumentId = sequenceGenerator.nextId("documents");

	const document = new Document({
		id: maxDocumentId,
		name: req.body.name,
		description: req.body.description,
		url: req.body.url
	});

	document.save()
		.then(createdDocument => {
			res.status(201).json({
				message: 'Document added successfully',
				document: createdDocument
			});
		})
		.catch(error => {
			res.status(500).json({
				message: 'An error occurred',
				error: error
			});
		});
});

module.exports = router;
