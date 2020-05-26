const express = require('express');

const { signRequestForUpload } = require('../aws');

const router = express();

router.post(
  '/aws/get-signed-request-for-upload-to-s3',
  async (req, res, next) => {
    try {
      const { fileType, prefix } = req.body;

      const returnData = await signRequestForUpload({
        fileType,
        prefix,
      });

      res.status(200).json(returnData);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
