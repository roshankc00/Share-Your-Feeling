const express=require("express")
const cors=require('cors')
const handleError = require("./middlewares/errorHandler")
const connectDb = require("./config/ConnectDb")
require('dotenv').config({path:"./config/.env"})
const cookieParser = require("cookie-parser")
const morgan=require('morgan')


// handeling the uncaughtException
process.on("uncaughtException",(error)=>{
    console.log(` Error:${error.message}`)
    console.log("shuttting down the server due to uncaughtException ")
    process.exit(1)
   
})

// connecting to the database 
connectDb()


// rest variables
const app=express()
const port=process.env.PORT



// routes imports
const userRoute=require('./routes/userRoutes')
const postRoute=require('./routes/postRoute')
const commentRoute=require('./routes/commentRoute')
// middlewares
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))
app.use(cookieParser())

// all the routes 
app.use("/api/v1",userRoute)
app.use("/api/v1",postRoute)
app.use("/api/v1",commentRoute)
app.use(handleError)


// listening to the port 
const server =app.listen(port,()=>{
    console.log(`listening at the port ${port}`)
})




// handeling the unhandled promise rejection
process.on("unhandledRejection",(error)=>{
    console.log(` Error:${error.message}`)
    console.log("shuttting down the server due to  unhandled promise rejection")
    server.close(()=>{
        process.exit(1);
    })
})
