const jwt=require("jsonwebtoken")
const checkAuth=async(req,res,next)=>{
    const token=req.cookies('token')
    if(!token){
        next({status:501,message:"do register or login first"})
    }
    const decorded=jwt.verify(token,process.env.SECRET)
    

}

module.exports={
    checkAuth
}