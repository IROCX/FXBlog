const mongoose = require('mongoose');

const Log = mongoose.model(
	'Log',
	new mongoose.Schema({
		timestamp: { type: Date, default: Date.now },
		method: String,
		url: String,
		status: Number,
		responseTime: Number,
		ip: String,
		headers: Object,
		query: Object,
		body: Object,
		user: Object,
		error: Object,
	})
);

module.exports = { Log };
