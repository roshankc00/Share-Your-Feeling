const mongoose=require('mongoose')

const connectDb=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>{
        console.log("sucessfully connected to the database")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports=connectDb