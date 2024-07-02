const mongoose = require('mongoose');

const otpSchema =  mongoose.Schema({
    otp:{
        type : String,
        required : true
    },
    sid:{
        type : String,
        required : true
    },
    createdAt :{
        type : String,
        required : true,
        default : Date.now()
    },
    
});




module.exports = mongoose.model('otp',otpSchema);