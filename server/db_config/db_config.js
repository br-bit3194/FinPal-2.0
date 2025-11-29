const { mongoose } = require("mongoose");

const connectDb = async () =>{
    try{
        console.log("Attempting to connect to MongoDB...")
        console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set")
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB connection successfull : ${conn.connection.name}`.bgYellow)

    }
    catch(error){
        console.log(`DB connection failed : ${error.message}`)
    }
} 

module.exports = connectDb