const mongoose=require('mongoose')

const commentSchemas=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true})

const Comment=mongoose.model("Comment",commentSchemas)
module.exports=Comment