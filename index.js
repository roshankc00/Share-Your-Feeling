const express=require("express")
const cors=require('cors')
// connecting to the database 

// rest variables
const app=express()
const port=5000


// routes imports


// middlewares
app.use(express.json())
app.use(cors())


// all the routes 
app.get("/",(req,res)=>{
    res.send("from server")
})
// listening to the port 
app.listen(port,()=>{
    console.log(`listening at the port ${port}`)
})