var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/flight');
var users= mongoose.Schema({
	fbid:{type:String},
	username:{type:String},
	email:{type:String},
	photo:{type:String}
});
module.exports=mongoose.model('User',users);