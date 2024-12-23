const express=require("express");
const app=express();
const cors=require("cors");
const {cors_origin}= require("./config.js")
const canvasRouter=require('./routes/canvasRouter.js')
const ApiResponse=require("./utils/ApiResponse.js")


app.use(cors({
    origin:[
        `${cors_origin}`
    ],
    credentials:true,
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:false,limit:"16kb"}));

app.use('/api/v1',canvasRouter)

app.use((error,req,res,next)=>{
    console.error(error)
    const response=new ApiResponse(error.statuscode||500,null,error.message||"Internal Server error")
    res.status(response.statuscode).json(response)
})

app.get("/",(req,res)=>{
    return res.send({message:"I am here"});
})

module.exports=app;