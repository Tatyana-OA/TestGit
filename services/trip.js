
//DATABASE OPERATIONS in service


const Trip = require('../models/Trip')
const User = require('../models/User')

async function createTrip(tripData) {
	const trip = new Trip(tripData)
	await trip.save();
	return trip; // to use in middleware or elsewhere in app
}
async function getAllTrips() {
	const trips = await Trip.find({}).lean()
	return trips;
}
async function getTripById (id) {
	const trips = await Trip.findById(id).populate('creator').populate('buddies').lean()
	return trips;
}

async function editTrip (id, tripData) {
	const trip = await Trip.findById(id)
	trip.startPoint = tripData.startPoint
	trip.endPoint = tripData.endPoint
	trip.date = tripData.date
	trip.time = tripData.time
	trip.carImg = tripData.carImg
	trip.price = Number(tripData.price)
	trip.description = tripData.description
	trip.seats = Number(tripData.seats)
	trip.imageUrl = tripData.imageUrl

	return trip.save()

}
async function deleteTrip(id) {
    return  Trip.findByIdAndDelete(id);
}
async function bookTrip(tripId,userId) {

	//calling info from both models
	const trip = await Trip.findById(tripId)
	const user = await User.findById(userId)
	console.log('THE TRIP', trip)
	if (user._id == trip.creator[0]) {
		throw new Error('Cannot book your own Trip!')
	}
	user.tripsHistory.push(trip)
	trip.buddies.push(user)
	trip.seats--;
//to save info in both models
	return Promise.all([user.save(), trip.save()]);

}


//TODO add other functions that find a user

module.exports = {
   getAllTrips,
   getTripById,
   createTrip,
   editTrip,
   deleteTrip,
   bookTrip
  // bookTrip
}