const express = require('express');
const app = express();

const messageRoutes = require('./routes/message');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/message', messageRoutes);
app.all('*', (req, res, next) => {
	res.status.json({
		error: true,
		message: 'This route is not found on this server',
	});
});

app.listen(3000, () => {
	console.log('Server is up and running....');
});
