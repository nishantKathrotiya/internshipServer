const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: function () {
          return (this.role === "student") ;
        },
    },
    lastName:{
        type: String,
        required: function () {
          return (this.role === "student");
        },
    },
    sid: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin','hod' , "committee"],
        default: 'student'
    },
    applications:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Applications',
    }],
    joinedAt: {
        type: Date,
        default: Date.now
    },
    email:{
        type: String,
        required: function () {
          return ( (this.role === "hod") || (this.role === "admin") || (this.role === "Committee") );
        },
    },
     department: {
        type: String,
        required: function () {
          return ( (this.role === "hod") || (this.role === "admin") || (this.role === "Committee") );
        },
        enum: ["DIT", "DCE", "DCS","CIT", "CCE", "CCS" , "ADM"],
      },
});

module.exports = mongoose.model('User', userLoginSchema);
