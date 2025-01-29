const mongoose = require('mongoose')
const {Schema}=mongoose;

const FormSchema = new Schema
({

    overall: { type: Number, required: true },
    Service_Type: { type: String, required: true },
    quality: { type: Number, required: true },
    timeline: { type: Number, required: true },
    money: { type: Number, required: true },
    support: { type: Number, required: true },
    msg: { type: String, required: true },
    user_Id: { type: String, required: true},
    user_Name: { type: String, required: true},
    date:{type:Date,default:Date.now},
  
} ,{ collection: 'FeedbackForm'})

module.exports= mongoose.model('form',FormSchema);