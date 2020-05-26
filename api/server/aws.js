const AWS = require('aws-sdk');

// config my AWS instance
const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
};

AWS.config.update(config);

const s3 = new AWS.S3();

exports.signRequestForUpload = ({ fileType, prefix }) => {
  const key = `${prefix}/avatar`;

  const params = {
    Bucket: process.env.AWS_AVATAR_BUCKET,
    Key: key,
    ContentType: fileType,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, (err, data) => {
      const returnedData = {
        signedRequest: data,
        url: `https://${process.env.AWS_AVATAR_BUCKET}.s3.amazonaws.com/${key}`,
      };

      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(returnedData);
      }
    });
  });
};
