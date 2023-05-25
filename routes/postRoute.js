const express=require('express')
const { createPost,createComment, deleteComment, likePost, getPost, getAllPosts, deletePost, dislike } = require('../controllers/postController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/post/create',checkAuth,createPost)
router.get('/post/like/:id',checkAuth,likePost)
router.get('/post/dislike/:id',checkAuth,dislike)
router.get('/post/:id',checkAuth,getPost)
router.get('/posts',checkAuth,getAllPosts)
router.delete('/post/:id',checkAuth,deletePost)

module.exports=router