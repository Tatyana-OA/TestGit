
//DATABASE OPERATIONS in service
    //create user
    //find user by email
    //find user by email -> project specific

const User = require('../models/User')

async function createUser(email,hashedPassword,gender) {

    const user = new User({
        email,
        hashedPassword,
		gender,
		tripsHistory: []


    })
    
    await user.save();
    return user; // to use in middleware or elsewhere in app
}

async function getUserByEmail (email) {
    const pattern = new RegExp(`^${email}$`, 'i')
    const user = await User.findOne({email: {$regex: pattern}})
    
    return user;
}


//TODO add other functions that find a user

module.exports = {
    createUser,
    getUserByEmail
}