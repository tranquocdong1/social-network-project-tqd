const multer = require("multer");
const path = require("path");
const ApiError = require("../utils/apiError");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "uploads")),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new ApiError(415, "UNSUPPORTED_MEDIA", "Only jpg/png/webp allowed"));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});

const wrap = (uploader) => (req, res, next) => {
  uploader(req, res, (err) => {
    if (err) return next(err);

    const host = `${req.protocol}://${req.get("host")}`;
    (req.files || []).forEach((f) => {
      f.fileUrl = `${host}/uploads/${f.filename}`;
    });

    next();
  });
};

wrap.array = (field, max) => wrap(upload.array(field, max));
module.exports = wrap;
