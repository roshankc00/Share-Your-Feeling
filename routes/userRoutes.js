const express=require('express')
const { body} = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const router=express.Router()


// all the  routes 
router.post("/register",[
    body('name',"name should be more than 5 digit").isLength({min:5}),
    body('email',"enter the valid email").isEmail(),
    body('password').isLength({min:8})

],registerUser)

router.post('/login',loginUser)
router.get('/logout',logoutUser)


module.exports=router

// const jwt=require("jsonwebtoken")
// const checkAuth=async(req,res,next)=>{
//     const token=req.cookies('token')
//     if(!token){
//         next({status:501,message:"do register or login first"})
//     }
//     const decorded=jwt.verify(token,process.env.SECRET)
//     console.log(decorded)
// }

// module.exports={
//     checkAuth
// }