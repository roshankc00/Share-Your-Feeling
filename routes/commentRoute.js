const express=require('express')
const { updateComment, deleteComment, registerComment } = require('../controllers/commentController')
const { checkAuth } = require('../middlewares/auth')
const router=express.Router()

router.post('/comment/create',checkAuth,registerComment)
router.put('/comment/:id',checkAuth,updateComment)
router.delete('/comment/:id',checkAuth,deleteComment)

module.exports=router 