const Post = require("../modals/postModel")
const createPost=async(req,res,next)=>{
    const {caption}=req.body
    try {
        if(!caption){
            next({status:400,message:"enter the caption"})
        }
        const post=await Post.create({
            caption,
            image:{
                imgid:"String",
                imgurl:"thisisimageUrl"
            }
        })
        res.status(200).json({
            sucess:true,
            message:"sucessfullly added to database",
            post
        })
    } catch (error) {
        next({message:error.message})  
    }
}






module.exports={
    createPost
}