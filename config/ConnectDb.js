const mongoose=require('mongoose')

const connectDb=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>{
        console.log("sucessfully connected to the database")
    }).catch(()=>{
        console.log("unable to connect the database")

    })
}


module.exports=connectDb 
