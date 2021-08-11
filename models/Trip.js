const {model, Schema} = require('mongoose')


const schema = new Schema({
    startPoint: {type:String, required:true},
    endPoint: {type:String, required:true},
	date: {type:String, required:true},
	time: {type:String, required:true},
	carImg: {type:String, required:true},
	carBrand: {type:String, required:true},
	seats: {type:Number, required:true},
	price: {type:Number, required:true},
	description: {type:String, required:true},
	creator: {type:String, required:true}, // will take the id from the current user
	buddies:  [{type:Schema.Types.ObjectId, ref: 'User', default: []}],

})

module.exports = model('Trip', schema)