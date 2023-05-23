const handleError=(err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error:true,
        message:err.message || "internal sever Error"
    })


}

module.exports=handleError