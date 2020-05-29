const express = require('express');
const Team = require('../models/Team');
const Channel = require('../models/Channel');
const { signRequestForUpload } = require('../aws');

const router = express();

router.post('/get-initial-data', async (req, res, next) => {
  try {
    let channels = [];
    const teams = await Team.getList({ userId: req.body.userId });
    if (teams.length > 0) {
      channels = await Channel.getList({ teamId: teams[0]._id });
    }
    return res.status(200).json({ teams, channels });
  } catch (err) {
    next(err);
  }
});

router.post('/add-team', async (req, res, next) => {
  try {
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

router.post('/add-channel', async (req, res, next) => {
  try {
    const channel = new Channel({
      name: req.body.name,
      teamId: req.body.teamId,
    });
    await channel.save();
    res.status(200).json({ channel });
  } catch (err) {
    next(err);
  }
});

router.post('/get-channels', async (req, res, next) => {
  try {
    const channels = await Channel.getList({ teamId: req.body.teamId });
    res.status(200).json({ channels });
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
