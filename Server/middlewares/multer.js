import multer from "multer";


const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'/tmp/');
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }

});


export const upload_file = multer({storage});


