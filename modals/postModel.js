const mongoose=require('mongoose')

const postSchema=mongoose.Schema({
    caption:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        comment:{
            type:String,
            required:true
        }
    }],    
},{timestamps:true})


const Post=mongoose.model("Post",postSchema)

module.exports=Post