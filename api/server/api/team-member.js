const express = require('express');
const Team = require('../models/Team');
const Channel = require('../models/Channel');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const { signRequestForUpload } = require('../aws');

const router = express();

router.post('/get-initial-data', async (req, res, next) => {
  try {
    let channels = [];
    let pendingAcceptances = [];
    let pendingInvitations = [];
    let result;
    const teams = await Team.getList({ userId: req.body.userId });
    console.log(teams);
    if (teams.length > 0) {
      result = await Promise.all([
        Channel.getList({ teamId: teams[0]._id }),
        Invitation.find({ inviterId: req.body.userId }),
        Invitation.find({ userId: req.body.userId }),
      ]);
      channels = result[0];
      pendingAcceptances = result[1];
      pendingInvitations = result[2];
    }

    return res.status(200).json({
      teams,
      channels,
      pendingAcceptances,
      pendingInvitations,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/invite-to-team', async (req, res, next) => {
  try {
    console.log(req.body);
    let invitation = Invitation.findOne({
      teamId: req.body.teamId,
      userEmail: req.body.userEmail,
    });
    let user = User.findOne({ email: req.body.userEmail });

    const result = await Promise.all([invitation, user]);

    if (!result[1]) {
      return res.status(400).json({ err: 'No user with this email exists.' });
    }

    if (result[0]) {
      return res
        .status(400)
        .json({ err: 'You have already invited this person to this team.' });
    }

    invitation = new Invitation({
      teamId: req.body.teamId,
      userId: result[1]._id,
      inviterId: req.body.inviterId,
      userEmail: result[1].email,
      teamName: req.body.teamName,
    });

    await invitation.save();
    return res.status(200).json({ invitation });
  } catch (err) {
    next(err);
  }
});

router.post('/add-team', async (req, res, next) => {
  try {
    if (
      await Team.findOne({ name: req.body.name, teamLeaderId: req.body.userId })
    ) {
      return res
        .status(400)
        .json({ err: 'You already have a team with a similar name.' });
    }
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

router.post('/delete-team', async (req, res, next) => {
  try {
    await Team.deleteOne({ _id: req.body.teamId });
    await Channel.deleteMany({ teamId: req.body.teamId });
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.post('/delete-channel', async (req, res, next) => {
  try {
    await Channel.deleteOne({ _id: req.body.channelId });
    res.status(200).json({});
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
