const mongoose=require('mongoose')

const connectDb=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>{
        console.log("sucessfully connected to the database")
    })
}


module.exports=connectDb 
