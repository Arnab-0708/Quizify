import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"  

const scoreSchema= mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    score:{
        type:String,
        required:true,
    },
})

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        index:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },

    password:{
        type:String,
        required:true,
    },
    score:[scoreSchema],
    
    refreshToken:{
        type:String,
    }
},
{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccesToken =  function () {

    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
    
}


userSchema.methods.generateRefreshToken =  function () {

    return  jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    
}






export const User = mongoose.model("User",userSchema)