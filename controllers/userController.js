const { validationResult, cookie } = require("express-validator");
const User = require("../modals/userModel");
const jwt=require('jsonwebtoken')








//---> register the user 
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    //   throwing the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //  throwing error for the multiple emails
    const user = await User.findOne({ email });
    if (user) {
      next({ status: 400, message: "user already exists" });
    }
    // saving the user in the database
    const newUser=await User.create({
        name,
        email,
        password
    })
    // creating the token 
    const obj={
        id:newUser._id
    }
    const token=jwt.sign(obj,process.env.SECRET)
    res.cookie("token",token,{
        expires:new Date(Date.now()+100*60*60*1000),
        httpOnly:true
    }).status(200).json({
        sucess:true,
        newUser
    })
    
  } catch (error) {
    next({ message: error.message });
  }
};






// //---> login the user 
const loginUser=async(req,res,next)=>{
    const {email,password}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            next({status:404,message:"invalid credentials"})
        }
        const isTrue=await user.matchPassword(password)
        if(!isTrue){
            next({status:404,message:"invalid credentials"})
        }
        const obj={
            id:user._id
        }
        const token=jwt.sign(obj,process.env.SECRET)
        res.cookie("token",token,{
            expires:new Date(Date.now()+100*60*60*1000),
            httpOnly:true
        }).status(200).json({
            sucess:true,
            message:"user has logged in sucess fully",
        })
     
        
        
    } catch (error) {
        next({message:error.message})          
    }
}



//---> logout the user 
const logoutUser=async(req,res,next)=>{
    // res.cookie('token',null)
    // res.send("wow")
    try {
        res.status(200).cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        }).json({
            sucess:true,
            message:"user has been sucessfully loged out"
        })
    } catch (error) {
        next({message:error.message})
    }
}


//---> follow the user 
const followUnfollowUser=async(req,res,next)=>{
    const followingId=req.body.followingId
    try {
        const followingUser=await User.findById(req.user._id)   // eg ma    //uslai follow garna 
        const followerUser=await User.findById(followingId)   // eg bhai     //uslai follow garna 
        let alreadyFollowing=false 
       

        followingUser.following.map((el)=>{
            if(followerUser._id.toString()===el.toString()){
                alreadyFollowing=true
            }
        })
        console.log(alreadyFollowing)
        // mero following bata bhai lai hatauna  bhai ko follower bara malai hatauna 
        if(alreadyFollowing){
            followingUser.following.map((el,ind)=>{
                if(followerUser._id.toString()===el.toString()){
                    followingUser.following.splice(ind,1)
                }
            })
            followerUser.followers.map((el,ind)=>{
                console.log(el)
                if(followingUser._id.toString()===el.toString()){
                    followerUser.followers.splice(ind,1)
                }
            })

            await followerUser.save()
            await followingUser.save()
        }else{
            // increase the following of my and increase the followers of  bhai 
             followerUser.followers.push(followingUser._id)
            followingUser.following.push(followerUser._id)
            await followerUser.save()
            await followingUser.save()
        }
      res.status(200).json({
        followerUser,followingUser
      })

       

    
        
        
    } catch (error) {
        next({message:error.message})

        
    }
}



// update the user password
const updateUserPassword=async(req,res,next)=>{
    const {email,oldPassword, newPassword,conformPassword,}=req.body
    try {
        const user=await User.findOne({email})
        if(!user){
            next({status:404,message:"user with this email dont exists"})
        }
        if(!user._id.toString()===req.user._id.toString()){
            next({status:404,message:"you cant change the password"})
        }
        if(newPassword!==conformPassword){
            next({status:400,message:"conform password and the password doesnt match"})
        }
        const isTrue=await user.matchPassword(oldPassword);
        


        if(!isTrue){
            next({status:400,message:"Enter the valid password"})
        }else{
            user.password=newPassword
            await user.save()
            res.status(200).cookie("token",null,{
                expires:new Date(Date.now()),
                httpOnly:true
            }).json({
                sucess:true,
                message:"user has been sucessfully Updated",
            })
        }
        


        
    } catch (error) {
        next({message:error.message})
    }
}



// update the userinformation   ###############################
const updateUser=async(req,res,next)=>{
    const {email,name,oldemail,oldpassword}=req.body
    let updateme={}
    if(email){
        updateme.email=email
    }
    if(name){
        updateme.name=name
    }
    
    const user=await User.findOne({email:oldemail})
    console.log(user)
    if(!user){
        next({status:404,message:"user with this email dont exists"})
    }
    if(!user._id.toString()===req.user._id.toString()){
        next({status:404,message:"you cant change the password"})
    }
    const updateduser=await User.findOneAndUpdate({email:oldemail},updateme,{new:true})

    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    }).json({
        sucess:true,
        message:"user has been sucessfully Updated",
        updateduser
    })



}




// 




module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUserPassword,
  updateUser
};
