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
router.get('/shared', async (req,res)=> {
	const trips = await req.storage.getAllTrips();
    res.render('trip/shared', {trips})
})

router.get('/details/:id', async (req,res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id)
        console.log(trip)
        console.log(req.user)
        // trip.hasUser = Boolean(req.user)
        // // attach variables to trip -> if there is a user and this user is the trip's author
         trip.isAuthor = req.user && req.user._id == trip.creator
        // // if the populated usersLiked includes the current user (so they cant like it again)
        // trip.liked = req.user && trip.usersLiked.find(u => u._id == req.user._id)

        res.render('trip/details', {trip})
    }
    catch(err) {
        console.log(err.message)
        res.redirect('/404')
    }

   
})



module.exports = router;
