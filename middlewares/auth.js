const jwt=require("jsonwebtoken")
const User = require("../modals/userModel")
const checkAuth=async(req,res,next)=>{
    // const {token}=req.headers
    let token;
    if(req.headers?.authorization?.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
    }
    if(!token){
        return  next({status:501,message:"do register or login first"})
    }else{

        
        const decorded=jwt.verify(token,process.env.SECRET)
        console.log(decorded.id)
        const user=await User.findById(decorded.id)
        if(!user){
           return  next({status:501,message:"do register or login first"})  
        }



        req.user=user
        next()
    }
}

module.exports={
    checkAuth
}