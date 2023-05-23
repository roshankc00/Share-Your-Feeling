const jwt=require("jsonwebtoken")
const User = require("../modals/userModel")
const checkAuth=async(req,res,next)=>{
    const {token}=req.cookies
    console.log(token)
    if(!token){
        console.log("kx")
        next({status:501,message:"do register or login first"})
    }
    const decorded=jwt.verify(token,process.env.SECRET)
    const user=await User.findById(decorded.id)
    if(!user){
        next({status:501,message:"do register or login first"})  
    }
    req.user=user
    next()

    

}

module.exports={
    checkAuth
}