const router = require('express').Router()
const {body,validationResult} = require('express-validator')
const {isGuest, isUser} = require('../middlewares/guards')
const { parseError } = require('../util/parsers')

router.get('/create', isUser(), (req,res) => {
    res.render('trip/create')
})
router.post('/create', isUser(), async (req,res) => {
    try{
        const tripData = {
			startPoint: req.body.startPoint,
			endPoint: req.body.endPoint,
			date: req.body.date,
			time: req.body.time,
			carImg: req.body.carImg,
			carBrand: req.body.carBrand,
			price: Number(req.body.price),
			description: req.body.description,
			seats: Number(req.body.seats),
			imageUrl: req.body.imageUrl,
            creator: req.user._id
           
        }
        await req.storage.createTrip(tripData)
        res.redirect('/')
    }
    catch(err) {
        const ctx = {
            errors: parseError(err),
            tripData: {
				startPoint: req.body.startPoint,
				endPoint: req.body.endPoint,
				date: req.body.date,
				time: req.body.time,
				carImg: req.body.carImg,
				price: Number(req.body.price),
				description: req.body.description,
				seats: Number(req.body.seats),
				imageUrl: req.body.imageUrl,
            }
           
        }
        res.render('trip/create',ctx)
    }
})


module.exports = router;
