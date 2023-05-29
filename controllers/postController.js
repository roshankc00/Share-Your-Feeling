const Post = require("../modals/postModel")
const User = require("../modals/userModel")
const cloudinary=require("cloudinary")
// create the post    ########
const createPost=async(req,res,next)=>{
    const {caption}=req.body
    console.log(caption)
    try {
        if(!caption){
            next({status:400,message:"enter the caption"})
        }
        const user=await User.findById(req.user._id)
        const cloud = cloudinary.uploader.upload(req.file.path)
        cloud.then(async(data) => {
        //   inserting user to the database
        const post=await Post.create({
            caption,
            thumbnail:{
                imgloc:req.file.path,
                imgurl:data.secure_url
            },
            user:req.user._id
        })
        user.posts.push(post._id)
        await user.save()
        res.status(200).json({
            sucess:true,
            message:"sucessfullly added to database",
            post,
            user
        })
        }).catch((err) => {
           next({message:err.message})
      
        });
        
  

       
    } catch (error) {
        next({message:error.message})  
    }
}




// liked the post 
const likePost=async(req,res,next)=>{
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


// dislike the post 
const dislike=async(req,res,next)=>{
    const postId=req.params.id
    try {
        const post=await Post.findById(postId)
        if(!post){
            next({status:404,message:"user not found"})
        }
        let aleradyliked=false
        post.dislikes.map((el)=>{
            if(el.toString()===req.user._id.toString()){
                aleradyliked=true
            }
        })
        // removing the likes if they exist by before 
        post.likes.map((el,ind)=>{
            if(post._id.toString()===postId){
                post.likes.splice(ind,1)
            }
        })





        if(aleradyliked){
          post.dislikes.filter((el,ind)=>{
            if(req.user._id.toString()===el.toString()){
                post.dislikes.splice(ind,1)
            }
          })
          await post.save()
          res.status(200).json({
            sucess:true,
            message:"post has dislike cancelled",
            post,
          })
        }else{
            post.dislikes.push(req.user._id)
            await post.save()
            res.status(200).json({
                sucess:true,
                message:"post has been sucessfully disliked",
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

const deletePost=async(req,res,next)=>{
    const id=req.params.id;
    try {
        const post=await Post.findById(id)
        const user=await User.findById(req.user._id)
        if(!post){
            next({status:404,message:"Post not found"})
        }
        user.posts.map((el,ind)=>{
            if(id===el.toString()){
                user.posts.splice(ind,1)
            }
        })
        await user.save()
        const deletePost=await Post.findByIdAndDelete(id)
        res.status(200).json({
            sucess:true,
            message:"user has sucessfully deleted" ,
            user
        })
       
    } catch (error) {
        next({message:error.message})
        
    }
}

const updateThumbnail=async(req,res,next)=>{

    try {
        console.log(await Post.findById(req.params.id))
        const cloud = cloudinary.uploader.upload(req.file.path)
        cloud.then(async(data) => {
        //   inserting user to the database
        const post=await Post.findByIdAndUpdate(req.params.id,{
            thumbnail:{
                imgloc:req.file.path,
                imgurl:data.secure_url
            },
        },{new:true})
       
        res.status(200).json({
            sucess:true,
            message:"sucessfullly updated the thumnail",
            post,
        })
        }).catch((err) => {
           next({message:err.message})
      
        });
        
  

       
    } catch (error) {
        next({message:error.message})  
    }
}


const updatePost=async(req,res,next)=>{
    const {caption}=req.body
    console.log(req.body)
    try {
        if(!caption){
            next({status:400,message:"provide the caption please"})
        }
        const post=await Post.findById(req.params.id)
        console.log(post)
        if(!post){
            next({status:404,message:"post doesnt exists"})
        }
        const updated=await Post.findByIdAndUpdate(req.params.id,{
            caption
        },{new:true})
        res.status(200).json({updated})
    } catch (error) {
        next({message:error.message})
        
    }
}

module.exports={
    createPost,
    likePost,
    dislike,
    getPost,
    getAllPosts,
    deletePost,
    updateThumbnail,
    updatePost
}
