import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsBase = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'vehicleImages') {
      cb(null, path.join(uploadsBase, 'vehicle-images'));
    } else if (file.fieldname === 'profileImage') {
      cb(null, path.join(uploadsBase, 'profile-images'));
    } else if (file.fieldname === 'organizationLogo') {
      cb(null, path.join(uploadsBase, 'organization-logos'));
    } else if (file.fieldname === 'verificationDocs') {
      cb(null, path.join(uploadsBase, 'verification-documents'));
    } else {
      cb(null, uploadsBase);
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const checkFileType = (file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.pdf'];
  const extension = path.extname(file.originalname).toLowerCase();
  const isImageOrPdf = file.mimetype?.startsWith('image/') || file.mimetype === 'application/pdf';

  if (allowedExtensions.includes(extension) || isImageOrPdf) {
    return cb(null, true);
  } else {
    cb(new Error('Images (JPG, PNG, WEBP, AVIF) and PDFs only!'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});
