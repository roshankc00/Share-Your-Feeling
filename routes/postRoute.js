const express=require('express')
const { createPost } = require('../controllers/postController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/post',checkAuth,createPost)

module.exports=router