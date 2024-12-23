require("dotenv").config();
const mongoose=require("mongoose")
const {DB_NAME,DB_URI}=require('../config.js')


const connectDB=async ()=>{
    try{
        const instance=await mongoose.connect(`${DB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB Host: ${instance.connection.host}`);
    }
    catch(error){
        console.error("MongoDB Connection Failed \n",error);
        process.exit(1);
    }
}

module.exports={connectDB}