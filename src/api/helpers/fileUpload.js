import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { FILES_EXTENSIONS, MAX_FILE_SIZE } from '../../constants';
import ApiError from './ApiError';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './src/public/users/images');
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}.${file.originalname.split('.')[1]}`);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (FILES_EXTENSIONS.indexOf(file.mimetype) === -1) {
      cb(null, false);
      return cb(new ApiError('Only .png, .jpg and .jpeg format allowed!', StatusCodes.BAD_REQUEST));
    }
    if (file.size > MAX_FILE_SIZE) {
      cb(null, false);
      return cb(new ApiError('Too big file', StatusCodes.BAD_REQUEST));
    }
    cb(null, true);
  },
});
