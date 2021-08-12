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
		console.log(trip.creator[0].email)
		trip.driver =  trip.creator[0].email;
		console.log('BUDDIES', trip.buddies)
		trip.buddyList = [];
		for (buddy of trip.buddies) {
			trip.buddyList.push(buddy.email)
			if (req.user.email==buddy.email) {
				trip.isJoined = true;
			}
		}
        // trip.hasUser = Boolean(req.user)
        // // attach variables to trip -> if there is a user and this user is the trip's author
         trip.isAuthor = req.user && req.user._id == trip.creator[0]._id
		 trip.notAuthor = !trip.isAuthor
		 trip.noSeats = trip.seats > 0 ? false : true;
        // // if the populated usersLiked includes the current user (so they cant like it again)
        // trip.liked = req.user && trip.usersLiked.find(u => u._id == req.user._id)

        res.render('trip/details', {trip})
    }
    catch(err) {
        console.log(err.message)
        res.redirect('/404')
    }


})
router.get('/edit/:id', isUser(), async (req,res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id)
        res.render('trip/edit', {trip})
    }
    catch(err) {
        console.log(err.message)
        res.redirect('/404')
    }


})
router.post('/edit/:id', isUser(), async (req,res) => {
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
        await req.storage.editTrip(req.params.id,tripData)
        res.redirect('/')
    }
    catch(err) {
        const ctx = {
            errors: parseError(err),
            trip: {
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
        res.render('trip/edit',ctx)
    }
})

router.get('/delete/:id', isUser(), async (req,res) => {
    //delete in the case of no delete page just button
    try {   
        const trip = await req.storage.getTripById(req.params.id)
        // check if this is the play's author
        if (trip.creator[0]._id != req.user._id) {
            throw new Error ('Cannot delete a play you did not create!')
        }
        await req.storage.deleteTrip(req.params.id)
        res.redirect('/')
    }catch(err) {
        console.log(err.message)
        res.redirect('/trip/details/' + req.params.id)
    }
})


router.get('/book/:id', isUser(), async (req,res) => {
    try {
        const trip = await req.storage.getTripById(req.params.id)
		await req.storage.bookTrip(req.params.id, req.user._id);


		res.redirect('/trip/details/' +req.params.id)
    }
    catch(err) {
        console.log(err.message)
        res.redirect('/404')
    }


})


module.exports = router;
