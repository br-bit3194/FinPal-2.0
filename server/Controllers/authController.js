const expressAsyncHandler = require("express-async-handler")
const User = require("../Models/userModel")
const jwt = require("jsonwebtoken")

const registerUser = expressAsyncHandler(async(req , res) => {
    
    const {name, email, firebaseIdToken} = req.body

    if(!name || !email){
        res.status(400)
        throw new Error("Please fill all the details")
    }

    // For now, we'll skip Firebase verification in development
    // In production, you should verify the Firebase ID token
    if (process.env.NODE_ENV === 'production' && !firebaseIdToken) {
        res.status(400)
        throw new Error("Firebase authentication required")
    }

    let user = await User.findOne({email})

    if(user) {
        res.status(200)
        res.json({
            name : user.name ,
            email : user.email , 
            id : user._id , 
            token : generateToken(user._id) 
        })
    }
    else{
        user = await User.create({name , email})
        if(!user){
            res.status(400)
            throw new Error ("Error in creating user")
        }

        res.status(200)
        res.json({
            name : user.name ,
            email : user.email , 
            id : user._id , 
            token : generateToken(user._id)
        })
    }
}
)

const generateToken = (id) => {
   return jwt.sign({id : id} , process.env.JWT_SECRET , {expiresIn : "30d"})
}

module.exports = {registerUser}