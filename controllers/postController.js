const Post = require("../modals/postModel")
const User = require("../modals/userModel")

// create the post    ########
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
            },
            user:req.user._id
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




// liked the post 
const likePost=async(req,res)=>{
    const postId=req.params.id
    try {
        const post=await Post.findById(postId)
        if(!post){
            next({status:404,message:"user not found"})
        }
        let aleradyliked=false
        post.likes.map((el)=>{
            if(el.toString()===req.user._id.toString()){
                aleradyliked=true
            }
        })
        if(aleradyliked){
          post.likes.filter((el,ind)=>{
            if(req.user._id.toString()===el.toString()){
                post.likes.splice(ind,1)
            }
          })
          await post.save()
          res.status(200).json({
            sucess:true,
            message:"post has unliked",
          })
        }else{
            post.likes.push(req.user._id)
            await post.save()
            res.status(200).json({
                sucess:true,
                message:"post has been sucessfully liked",
                post
            })
        }

        
    } catch (error) {
        next({message:error.message})
        
    }
}


// get a single post 
const getPost=async(req,res,next)=>{
    const id=req.params.id
    try {
        const post=await Post.findById(id).populate('user').populate('likes').populate('comments')
        if(!post){
            next({status:404,message:"Post not found"})
        }

        else{
            res.status(200).json({
                sucess:true,
                post
            })
        }

        
    } catch (error) {
        next({message:error.message})
        
    }
}


// get all the posts 
const getAllPosts=async(req,res,next)=>{
    try {
        const posts=await Post.find({}).populate('user').populate('likes')
        res.status(200).json({
            sucess:true,
            posts
        })
        
    } catch (error) {
        next({message:error.message})
        
    }
}

module.exports={
    createPost,
    likePost,
    getPost,
    getAllPosts
}