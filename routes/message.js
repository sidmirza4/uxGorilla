const express = require('express');
const router = express.Router();
const {
	getAllMessages,
	addNewMessage,
	getMessage,
	updateMessage,
} = require('../controllers/message');

router.route('/').get(getAllMessages).post(addNewMessage);
router.route('/:id').get(getMessage).put(updateMessage);

module.exports = router;
