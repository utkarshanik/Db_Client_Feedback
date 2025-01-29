const mongoose = require('mongoose');
const {Schema}=mongoose;

const UserSchema = new Schema
({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    
    role: { type: String, default: "user" },
} ,{ collection: 'UserCredentials'})

module.exports= mongoose.model('user',UserSchema);
// This line creates a Mongoose model named 'user' based on the UserSchema.
// exports this model so that other parts of the application can use it to interact with the 'users' collection in the database.