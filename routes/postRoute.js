const express=require('express')
const { createPost,createComment, deleteComment, likePost } = require('../controllers/postController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/post',checkAuth,createPost)
router.post('/post/comment/:id',checkAuth,createComment)
router.delete('/post/comment/:id',checkAuth,deleteComment)
router.get('/post/like/:id',checkAuth,likePost)

module.exports=router