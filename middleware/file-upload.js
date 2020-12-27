const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
    secretAccessKey: 'yyoekfXXNpfxxQ6iJlIRl0cHkwaKFG4HEc3QL1Vo',
    accessKeyId: 'AKIAIKEGTLNU4PBNL3HQ',
    region: 'us-east-2'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'buddyimages',
        fileFilter: fileFilter,
        key: function (req, file, cb) {
            console.log(file);
            cb(null, new Date().toISOString() + '-' + file.originalname);
        }
    })
});

module.exports = upload;