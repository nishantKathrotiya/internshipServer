const mongoose = require('mongoose');

const dbConnect = async ()=>{
    console.log("Function Called")
    try{
        mongoose.connect('mongodb+srv://22dit022:NMQDoycTDl2I2Tau@cluster0.xqfr7hj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(()=>{
            console.log('DB Connected')
        })
        .catch((err)=>{
            console.log('DB Does not Connected');
        })

    }catch(errr){
        console.log("Can  not connected to DB Some Internal server Err")
    }
}

module.exports = dbConnect;
