// config folder is used to configure db connection


const mongoose = require('mongoose')

// const connection = mongoose.connect('mongodb://0.0.0.0/user').then(() => (
//     console.log("connected to database")               //without using dotenv package
// ))

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connected to database")
    })
}

module.exports = connectToDB