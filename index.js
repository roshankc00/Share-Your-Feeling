const express=require("express")

const app=express()
const port=5000

app.get("/",(req,res)=>{
    res.send("from server")
})
app.listen(port,()=>{
    console.log(`listening at the port ${port}`)
})