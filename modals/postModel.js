const mongoose=require('mongoose')

const postSchema=mongoose.Schema({
    caption:{
        type:String
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    thumbnail:{
     imgloc:String,
        imgurl:String
     },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
    
},{timestamps:true})

const Post=mongoose.model("Post",postSchema)

module.exports=Post
