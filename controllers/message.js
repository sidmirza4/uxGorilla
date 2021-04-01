const fs = require('fs');
const uuid = require('uuid').v4;

// error handling can be done better , but for this small task, it will be an overkill
//  I could write a higher order function to omit try and catch in every function

const getAllMessages = () => {
	const allMessages = JSON.parse(
		fs.readFileSync(`${process.cwd()}/data/data.json`, 'utf-8')
	);
	// messages are sorted by time they were created
	return [...allMessages].sort((a, b) => b.createdOn - a.createdOn);
};

const getMessageById = (id) => {
	const allMessages = getAllMessages();
	let message;
	for (let msg of allMessages) {
		if (msg.id === id) {
			message = msg;
		}
	}
	return message;
};

const writeAllMessages = (msgs) => {
	fs.writeFileSync(
		`${process.cwd()}/data/data.json`,
		JSON.stringify(msgs, null, 2)
	);
};

module.exports = {
	getAllMessages(req, res, next) {
		try {
			const allMessages = getAllMessages();
			res.json({
				status: 'success',
				messages: allMessages,
			});
		} catch (error) {
			res.status(500).json({
				status: 'failed',
				message: error.message || 'Something went wrong',
			});
		}
	},

	addNewMessage(req, res, next) {
		try {
			const { text } = req.body;
			const newMessage = {
				id: uuid(),
				createdOn: Date.now(),
				updatedOn: Date.now(),
				text,
			};

			const allMessages = getAllMessages();
			const newAllMessages = [...allMessages, newMessage];

			writeAllMessages(newAllMessages);

			res.status(201).json({
				status: 'success',
				message: newMessage,
			});
		} catch (error) {
			res.status(500).json({
				status: 'failed',
				message: error.message || 'Something went wrong',
			});
		}
	},

	getMessage(req, res, next) {
		try {
			const { id } = req.params;
			const message = getMessageById(id);

			if (!message) {
				res.status(404).json({
					status: 'failed',
					message: 'No message found with that id',
				});
			}

			res.json({
				status: 'success',
				message,
			});
		} catch (error) {
			res.status(500).json({
				status: 'failed',
				message: error.message || 'Something went wrong',
			});
		}
	},

	updateMessage(req, res, next) {
		try {
			const { id } = req.params;
			const { text } = req.body;
			const allMessages = getAllMessages();
			const index = allMessages.findIndex((msg) => msg.id === id);
			if (index === -1) {
				res.status(404).json({
					status: 'failed',
					message: 'No message found with that id',
				});
			}
			const message = getMessageById(id);
			const updatedMessage = {
				...message,
				text,
				updatedOn: Date.now(),
			};

			allMessages.splice(index, 1, updatedMessage);
			writeAllMessages(allMessages);

			res.json({
				status: 'success',
				message: updatedMessage,
			});
		} catch (error) {
			res.status(500).json({
				status: 'failed',
				message: error.message || 'Something went wrong.',
			});
		}
	},
};
