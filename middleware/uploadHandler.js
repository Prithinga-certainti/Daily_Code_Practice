const multer = require('multer');
const oath=require('path');
const{ensureUploadDir,generateFilename}=require('../utils/fileUtils');
const upload_constants=require('../constants/uploadConstants');
require('dotenv').config();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = ensureUploadDir();
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueFilename = generateFilename(file.originalname);
        cb(null, uniqueFilename);
    }
})
const fileFilter = (req, file, cb) => {
    const ext=path.extname(file.originalname).toLowerCase().replace('.','');
    const mimetype=file.mimetype;
    const isvalidext=upload_constants.ALLOWED_FILE_TYPES.includes(ext);
    const isvalidmime=upload_constants.ALLOWED_MIME_TYPES.includes(mimetype);
    if(isvalidext && isvalidmime){
        cb(null,true);
    }else{
        cb(new Error('Invalid file type.'),false);
    }
}
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: upload_constants.MAX_FILE_SIZE }
});
module.exports=upload.single('file');
