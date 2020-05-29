const express = require('express');
const Team = require('../models/Team');
const { signRequestForUpload } = require('../aws');

const router = express();

router.post('/get-initial-data', async (req, res, next) => {
  try {
    const teams = await Team.getList({ userId: req.body.userId });
    return res.status(200).json({ teams });
  } catch (err) {
    next(err);
  }
});

router.post('/add-team', async (req, res, next) => {
  try {
    console.log(req.body);
    const team = new Team({
      name: req.body.name,
      teamLeaderId: req.body.userId,
      memberIds: [req.body.userId],
    });
    await team.save();
    res.status(200).json({ team });
  } catch (err) {
    next(err);
  }
});

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
