const {model, Schema} = require('mongoose')


const schema = new Schema({
    email: {type:String, required:true},
    hashedPassword: {type:String, required:true},
	gender: {type:String, required:[true, 'Gender is required']},
	tripsHistory: [{type:Schema.Types.ObjectId, ref: 'Trip', default: []}]
})

module.exports = model('User', schema)