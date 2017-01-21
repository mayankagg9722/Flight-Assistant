var mongoose=require('mongoose');
var Details = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    flight: {
        type: Object,
        required: true
    }
});


module.exports=mongoose.model('Details',Details);