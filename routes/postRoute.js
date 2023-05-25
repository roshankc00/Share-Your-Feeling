const express=require('express')
const { createPost,createComment, deleteComment, likePost, getPost, getAllPosts } = require('../controllers/postController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/post',checkAuth,createPost)
router.get('/post/like/:id',checkAuth,likePost)
router.get('/post/:id',checkAuth,getPost)
router.get('/posts',checkAuth,getAllPosts)

module.exports=router