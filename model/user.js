var mongoose=require('mongoose');
var SALT=10;
var bcrypt = require('bcrypt');
var User = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
	mobile_number: {
        type: String,
        required: true
    },
	email: {
        type: String,
        required: true,
    },
    referral:{
        type:String
    }
});

User.methods.comparePassword=function(password){
	return (bcrypt.compareSync(password, this.password));
};

User.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports=mongoose.model('User',User);