// Connecting to DataBase......
// URI =>URI (Uniform Resource Identifier):
// A URI is a string that specifies how to access a resource (in this case, your MongoDB database).
//URL =>URL (Uniform Resource Locator):
// A URL is a specific type of URI that provides the location of a resource on the internet.


const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI= process.env.mongoURI ;
const connec_To_Mongo=async()=>{
    try{
        await mongoose.connect(mongoURI);
        console.log("connected To Databae Succefully !!!")
        }
    catch(error)
    {
    console.error("Database Connection Failed !!",error);
    }
};

module.exports = connec_To_Mongo;