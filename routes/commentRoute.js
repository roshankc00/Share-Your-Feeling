const express=require('express')
const { createComment, updateComment, deleteComment } = require('../controllers/commentController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/comment/create',checkAuth,createComment)
router.put('/comment/:id',checkAuth,updateComment)
router.delete('/comment/:id',checkAuth,deleteComment)

module.exports=router