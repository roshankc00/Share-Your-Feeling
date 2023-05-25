const express=require('express')
const { body} = require('express-validator');
const { registerUser, loginUser, logoutUser,followUnfollowUser,updateUserPassword,updateUser, blockUnblockUser, getUser, getAllUsers, getMe } = require('../controllers/userController');
const { checkAuth } = require('../middlewares/auth');
const router=express.Router()


// all the  routes 
router.post("/user/register",[
    body('name',"name should be more than 5 digit").isLength({min:5}),
    body('email',"enter the valid email").isEmail(),
    body('password').isLength({min:8})
],registerUser)

router.post('/user/login',loginUser)
router.get('/user/logout',checkAuth,logoutUser)
router.get('/user/followunfollow',checkAuth,followUnfollowUser)
router.get('/user/followunfollow',checkAuth,followUnfollowUser)
router.put('/user/update/user',checkAuth,updateUser)
router.get('/user/myprofile',checkAuth,getMe)
router.get('/user/blockunblock/:id',checkAuth,blockUnblockUser)
router.get('/user/:id',checkAuth,getUser)
router.get('/users',checkAuth,getAllUsers)
module.exports=router


