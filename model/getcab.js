var mongoose=require('mongoose');
var getCab = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: String,  //(2017-01-22)
        required: true
    },
    time:{
         type: String, //24 hour format (16:00)
        required: true
    },
    current_location:{
         type: String,
        required: true
    },
    destination:{
         type: String,
        required: true
    },
    number_of_person:{
         type: String,
    },
    car:{
        type:String
    }
});


module.exports=mongoose.model('getCab',getCab);