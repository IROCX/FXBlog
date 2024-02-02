function errorHandlingMiddleware(req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
}
module.exports = { errorHandlingMiddleware };
