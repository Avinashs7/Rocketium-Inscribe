
const {connectDB}=require("./db/config.js");
const app=require("./app.js")
const PORT=8000
const logger=require("./utils/Logger.js")


//DB connection logic 
connectDB()
.then(()=>{
    //When the app is activated then in event on if there is an error occured then it terminates the process.
    app.on("error",(error)=>{
        console.error(error);
        process.exit(1);
    })
    app.listen(PORT,()=>{
        logger.info(`Server is running at http://localhost:${PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB error",error);
})