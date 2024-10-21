import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: `./avatars/`,

  filename: function (req, file, callBack) {
    callBack(null, `${req.params.id}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

export default upload;