const Comment = require("../modals/commentModel")
const Post = require("../modals/postModel")



// create comment 
const createComment=async(req,res,next)=>{
    const {comment,postId}=req.body
 console.log("nepal")
    try {
        if(!comment){
            next({status:400,message:"comment field is necessary"})
        }
        const post=await Post.findById(postId)
        console.log(post)
        const userCmt=await Comment.create({
            comment,
            user:req.user._id
        })
        post.comments.push(userCmt._id)
        await post.save()
        res.status(200).json({
            sucess:true,
            message:"comment has added",
            userCmt,
            post
        })
    } catch (error) {
        next({message:error.message})
    }
}


// update the comment 
const updateComment=async(req,res,next)=>{
    const {comment,postId}=req.body
    const cmtId=req.params.id
    console.log(comment)
    console.log(cmtId)
    try {
        if(!comment){
            next({status:400,message:"comment field is necessary"})
        }
        const post=await Post.findById(postId)
        if(!post){
            next({status:404,message:"comment not found"})
        }
        
        const updatedCmt=await Comment.findByIdAndUpdate(cmtId,{comment},{new:true})
        res.status(200).json({
            sucess:true,
            updatedCmt
        })
    } catch (error) {
        next({message:error.message})
        
    }
}

const deleteComment=async(req,res,next)=>{
    try {
        const cmt=await Comment.findById()
        const deleteComment=await Comment.findByIdAndDelete(req.params.id)
        if(!deleteComment){
            next({status:404,message:"comment not found"})
        }
        const post=await Post.findById(req.body.postId)
        if(!post){
            next({status:404,message:"Post not founnd"})
        }
        post.comments.map((el,ind)=>{
            if(req.params.id!==el.toString()){
                next({status:400,message:"no such comment exists"})
            }
            if(req.params.id===el.toString()){
                post.comments.splice(ind,1)
            }
        })
        await post.save()
        console.log(deleteComment)
        res.status(200).json({
            sucess:true,
            post,
            deleteComment
        })
      
    } catch (error) {
        next({message:error.message})
        
    }
}

module.exports={
    createComment,
    updateComment,
    deleteComment
}