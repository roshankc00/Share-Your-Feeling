const Comment = require("../modals/commentModel")
const Post = require("../modals/postModel")


const registerComment=async(req,res,next)=>{
    console.log(req.body)
    // try {
    //     res.send(req.body)
    //     console.log(req.body)
        
    // } catch (error) {
    //     next({error})
        
    // }

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
        const deleteComment=await Comment.findById(req.params.id)
        if(!deleteComment){
            next({status:404,message:"comment not found"})
        }
        const post=await Post.findById(req.body.postId)
        if(!post){
            next({status:404,message:"Post not founnd"})
        }
        if(req.user._id.toString()===deleteComment.user.toString() || req.user._id.toString()===post._id.toString()){

            const delCmt=await Comment.findByIdAndDelete(req.params.id)
            post.comments.map((el,ind)=>{
                if(req.params.id!==el.toString()){
                    console.log("wow")
                    console.log("wow")
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
        }else{
            next({status:400,message:"you cant delete it"})
        }
            
    } catch (error) {
        next({message:error.message})
        
    }
}
module.exports={
    registerComment,
    updateComment,
    deleteComment
}