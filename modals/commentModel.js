const mongoose=require('mongoose')
const commentSchema=mongoose.Schema({
    comment:{
        type:String,
        required:true
    }
},{timestamps:true})


const Comment=mongoose.model("Comment",commentSchema)
module.exports=Comment