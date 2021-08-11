module.exports = () => (req,res,next) => {
	const tripService = require('../services/trip')
    //TODO import and decorate services

    req.storage  = {
		...tripService
	}

    next()
}