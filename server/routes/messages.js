var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');
const Contact = require('../models/contact');

router.get('/', (req, res, next) => {
	Message.find()
		.populate('sender')
		.then(messages => {
			res
				.status(200)
				.json({
					message: 'Messages fetched successfully',
					messages: messages
				})
		})
		.catch(error => {
			res.status(500).json({
				message: 'An error occurred',
				error: error
			})
		})
});

router.post('/', (req, res, next) => {
	const maxMessageId = sequenceGenerator.nextId("messages");
	// let senderId = Contact.findOne({id: '107'})
	// 	.then(contact => {
	// 		senderId = contact._id
	// 	})
	// 	.catch(err => {
	// 		console.log(err)
	// 	});

	console.log("MESSAGE POST DATA: \n subject: ", req.body.subject, " message: ", req.body.msgText, " sender: ");
	const message = new Message({
		id: maxMessageId,
		subject: req.body.subject,
		msgText: req.body.msgText,
		sender: req.body.sender
	});

	message.save()
		.then(createdMessage => {
			res.status(201).json({
				responseMsg: 'Message added sucessfully',
				message: createdMessage
			})
		})
		.catch(error => {
			res.status(500).json({
				message: 'An error occurred',
				error: error
			});
		});
});

router.put('/:id', (req, res, next) => {
	Message.findOne({id: req.params.id})
		.then(message => {
			message.subject = req.body.subject;
			message.msgText = req.body.message;

			Message.updateOne({id: req.params.id}, message)
				.then(result => {
					res.status(204).json({
						message: 'Message updated successfully'
					});
				})
				.catch(error => {
					res.status(500).json({
						message: 'An error occurred',
						error: error
					});
				});
		})
		.catch(error => {
			res.status(500).json({
				message: 'Message not found.',
				error: {message: 'Message not found'}
			});
		});
});

router.delete("/:id", (req, res, next) => {
	Message.findOne({id: req.params.id})
		.then(document => {
			Message.deleteOne({id: req.params.id})
				.then(result => {
					res.status(204).json({
						message: "Message deleted successfully"
					});
				})
				.catch(error => {
					res.status(500).json({
						message: 'An error occurred',
						error: error
					});
				})
		})
		.catch(error => {
			res.status(500).json({
				message: 'Message not found.',
				error: {message: 'Message not found'}
			});
		});
});

module.exports = router;
