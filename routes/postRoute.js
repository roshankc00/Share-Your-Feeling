const express=require('express')
const { createPost,createComment, deleteComment, likePost, getPost, getAllPosts, deletePost, dislike, updateThumbnail, updatePost } = require('../controllers/postController')
const { checkAuth } = require('../middlewares/auth')
const upload = require('../middlewares/multer')
const router=express.Router()

router.get('/posts',checkAuth,getAllPosts)
router.post('/post/create',checkAuth,upload.single('thumbnail'),createPost)
router.get('/post/like/:id',checkAuth,likePost)
router.get('/post/dislike/:id',checkAuth,dislike)
router.get('/post/:id',getPost)
router.delete('/post/:id',checkAuth,deletePost)
router.put('/post/thubnail/:id',checkAuth,upload.single("thumbnail"),updateThumbnail)
router.put('/post/:id',checkAuth,updatePost)

module.exports=router

