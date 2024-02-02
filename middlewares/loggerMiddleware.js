const { Log } = require('../models/logger');

function loggerMiddleware(req, res, next) {
	const start = Date.now();

	const log = new Log({
		method: req.method,
		url: req.url,
		ip: req.ip,
		headers: req.headers,
		query: req.query,
		body: req.body,
		user: req.user || 'guest',
	});

	res.on('finish', () => {
		log.status = res.statusCode;
		log.responseTime = Date.now() - start;

		log.save((err) => {
			if (err) {
				console.error('Error saving log to MongoDB:', err);
			}
		});
	});

	res.on('close', () => {
		if (res.statusCode >= 400) {
			log.status = res.statusCode;
			log.error = {
				message: res.statusMessage,
				stack: res.stack,
			};

			log.save((err) => {
				if (err) {
					console.error('Error saving error log to MongoDB:', err);
				}
			});
		}
	});

	next();
}

module.exports = { loggerMiddleware };
