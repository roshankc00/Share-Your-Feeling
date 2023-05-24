const express=require('express')
const { body} = require('express-validator');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const { checkAuth } = require('../middlewares/auth');
const router=express.Router()


// all the  routes 
router.post("/user/register",[
    body('name',"name should be more than 5 digit").isLength({min:5}),
    body('email',"enter the valid email").isEmail(),
    body('password').isLength({min:8})

],registerUser)

router.post('/user/login',loginUser)
router.get('/user/logout',logoutUser)

module.exports=router

