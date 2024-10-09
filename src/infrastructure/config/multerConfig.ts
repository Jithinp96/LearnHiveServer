import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(null, false);  
    }
  }
}).single('video');