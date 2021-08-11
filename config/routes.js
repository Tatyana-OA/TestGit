const authController = require('../controllers/authController')
const tripController = require('../controllers/tripController')
const homeController = require('../controllers/homeController')

module.exports = (app) => {
    //whenever a request starting with /auth is received, authController tackles rest
    app.use('/auth', authController);
	app.use('/trip', tripController);
	app.use('/', homeController)
}