const User = require("../modals/userModel");
const jwt=require('jsonwebtoken');
const Post = require("../modals/postModel");
const cloudinary=require('cloudinary');
const crypto=require('crypto')
const { sendEmail } = require("../middlewares/sendEmail");


//---> register the user        #####
const registerUser = async (req, res, next) => {
  const { name, email, password,avatar} = req.body;
  console.log(req.file)
  try {
  
      const user = await User.findOne({ email });
      let newUser;
      //  throwing error for the multiple emails
    if (user) {
      next({ status: 400, message: "user already exists" });
    }
    // inserting image to cloudinary
    const cloud = cloudinary.uploader.upload(req.file.path)
    cloud.then(async(data) => {
    //   inserting user to the database
          newUser=await User.create({
            name,
            email,
            password,
            profile:{
                path:req.file.path,
                url:data.secure_url
            }           

        })
    // sending the correct response 
        res.status(200).json({
            sucess:true,
            message:"user has been created",
            newUser
        })
    }).catch((err) => {
       next({message:err.message})
  
    });

    
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
    const followingId=req.body.id
    try {
        const followingUser=await User.findById(req.user._id)   // eg ma    //uslai follow garna 
        const followerUser=await User.findById(followingId)   // eg bhai     //uslai follow garna 
        let alreadyFollowing=false 
       

        followingUser.following.map((el)=>{
            if(followerUser._id.toString()===el.toString()){
                alreadyFollowing=true
            }
        })
        // mero following bata bhai lai hatauna  bhai ko follower bara malai hatauna 
        if(alreadyFollowing){
            followingUser.following.map((el,ind)=>{
                if(followerUser._id.toString()===el.toString()){
                    followingUser.following.splice(ind,1)
                }
            })
            followerUser.followers.map((el,ind)=>{
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



// block and unblock the users 
const blockUnblockUser=async(req,res,next)=>{
    const userId=req.params.id   
    let alreadyblocked=false;
        try{
        const blockingUser=await User.findById(req.user._id)
        const blockedUser=await User.findById(userId)
       
        blockingUser.blocked.map((el)=>{
            if(blockedUser._id.toString()===el.toString()){
                alreadyblocked=true
            }
        })
            if(alreadyblocked){
                blockedUser.blockedBy.map((el,ind)=>{
                    if(blockingUser._id.toString()===el.toString()){
                        blockedUser.blockedBy.splice(ind,1)
                    }
                  
                })
                blockingUser.blocked.map((el,ind)=>{
                    if(blockedUser._id.toString()===el.toString()){
                        blockingUser.blocked.splice(ind,1)
                    }
                })
                await blockingUser.save()
                await blockedUser.save()
                return res.status(200).json({
                    sucess:true,
                    message:"user has been unblocked sucssfully",
                })
            
            }
            else{
                blockingUser.blocked.push(blockedUser._id)
                blockedUser.blockedBy.push(blockingUser._id)
                await blockingUser.save()
                await blockedUser.save()
                res.status(200).json({
                    sucess:true,
                    message:"user has been sucessfully blocked",
                   
                })

            }
           
       
       
        res.status(200).json({
            blockedUser,
            blockingUser
        })

    
    }catch (error) {
        next({message:error.message})
        
    }
}





// update the userinformation   
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




//get a single user with id 
const getUser=async(req,res,next)=>{
    try {
        const user=await User.findById(req.params.id).populate('following').populate("followers").populate("blocked").populate('blockedBy').populate('posts')
        res.status(200).json({
            sucess:true,
            user
        })
        
    } catch (error) {
        next({message:error.message})
        
    }
}



// get all the users 
const getAllUsers=async(req,res,next)=>{
    try {
        const users=await User.find({}).populate('following').populate("followers").populate("blocked").populate('blockedBy').populate('posts')
        res.status(200).json({
            sucess:true,
            users
        })
        
    } catch (error) {
        next({message:error.message})
        
    }
}
// delete the user 
const deleteUser=async(req,res,next)=>{
    try {
        if(req.user._id.toString()!==req.params.id){
            next({status:404,message:"you are not the user"})
        }
        await User.findByIdAndDelete(req.params.id)
        res.status(200).cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly:true
        }).json({
            sucess:true,
            message:"user has been deleted sucessfully"
        })
    } catch (error) {
        next({message:error.message})
    }
}






// getYour profiles
const getMe=async(req,res,next)=>{
    try {
        const profile=await User.find(req.user._id).populate('following').populate("followers").populate("blocked").populate('blockedBy').populate('posts')
        res.status(200).json({
            sucess:true,
            profile
        })
        
    } catch (error) {
        next({message:error.message})
        
    }
}



const changeProfile=async(req,res,next)=>{
    console.log(req.file)
    try {
    
        const user = await User.findById(req.params.id);
        let newUser;
        //  throwing error for the multiple emails
      if (!user) {
        next({ status: 404, message: "user already exists" });
      }
      // inserting image to cloudinary
      const cloud = cloudinary.uploader.upload(req.file.path)
      cloud.then(async(data) => {
      //   inserting user to the database
            newUser=await User.findByIdAndUpdate(req.params.id,{
             
              profile:{
                  path:req.file.path,
                  url:data.secure_url
              }     
  
          },{new:true})
      // sending the correct response 
          res.status(200).json({
              sucess:true,
              message:"user has been updated",
              newUser
          })
      }).catch((err) => {
         next({message:err.message})
    
      });
  
      
    } catch (error) {
      next({ message: error.message });
    }
  };

  const forgetPassword=async(req,res,next)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(!user){
            next({status:404,message:"user doesnt exists"})
        }
        const resetPasswordToken=await user.getResetPasswordToken();
        await user.save()
        console.log(user)
        const resetUrl=`${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetPasswordToken}`
        const message=`Reset Your password on clicking:\n ${resetUrl} `
        try {
            await sendEmail({
                email:user.email,
                subject:"reset the password",
                message
            })
            res.status(200).json({
                sucess:true,
                message:` email sent to ${user.email}`
            
            })
        } catch (error) {
            user.resetPasswordToken=undefined,
            user.reserPasswordExpire=undefined,
            user.save()
            next({message:"unable to send the email"})
            
        }
        
    } catch (error) {
        next({message:error.message})
        
    }
  }

  const resetPassword=async(req,res,next)=>{
    try {

        const resetPasswordToken=await crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
        console.log(resetPasswordToken,"re")
        console.log(req.params.token,"token")
        const user=await User.findOne({
            resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()},
        })
        if(!user){
            next({status:401,message:"token is invalid or expires"})
        }

        user.password=req.body.password
        user.reserPasswordExpire=undefined
        user.reserPasswordToken=undefined
        await user.save();
        res.status(200).json({
            sucess:true,
            message:"password updated sucessfully"
        })
   
    } catch (error) {
        next({message:error.message})
        
    }

  }
 

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  followUnfollowUser,
  updateUserPassword,
  updateUser,
  blockUnblockUser,
  getUser,
  getAllUsers,
  getMe,
  changeProfile,
  forgetPassword,
  resetPassword,
  deleteUser
};


