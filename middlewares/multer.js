const multer=require('multer')


// const storage = multer.memoryStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })
  

const storage=multer.memoryStorage();

const singleUpload=multer({storage}).single("file")

module.exports=singleUpload;