const express = require('express');
const Team = require('../models/Team');
const Channel = require('../models/Channel');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const Message = require('../models/Message');
const DirectMessage = require('../models/DirectMessage');
const { signRequestForUpload } = require('../aws');

const router = express();

router.post('/get-team', async (req, res, next) => {
  try {
    const team = await Team.findById(req.body.teamId).lean();
    if (!team) {
      return res.status(400).json({ err: 'Sorry. This team no longer exists' });
    }
    const channels = await Channel.find({ teamId: req.body.teamId }).lean();
    let messages = [];
    let currentUsers = [];
    if (channels.length > 0) {
      messages = await Message.find({ channelId: channels[0]._id }).lean();
    }
    currentUsers = await User.find(
      { _id: { $in: team.memberIds } },
      '_id displayName email avatarUrl'
    ).lean();
    res.status(200).json({ team, channels, messages, currentUsers });
  } catch (err) {
    next(err);
  }
});

router.post('/get-accepted-user', async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).json({ user });
  } catch (err) {}
});

router.post('/get-initial-data', async (req, res, next) => {
  try {
    let channels = [];
    let pendingAcceptances = [];
    let pendingInvitations = [];
    let currentUsers = [];
    let messages = [];
    let result;
    const teams = await Team.getList({ userId: req.body.userId });

    if (teams.length > 0) {
      result = await Promise.all([
        Channel.getList({ teamId: teams[0]._id }),
        Invitation.find({ inviterId: req.body.userId }),
        Invitation.find({ userId: req.body.userId }),
        User.find(
          { _id: { $in: teams[0].memberIds } },
          '_id displayName email avatarUrl'
        ),
      ]);
      channels = result[0];
      pendingAcceptances = result[1];
      pendingInvitations = result[2];
      currentUsers = result[3];
      if (channels.length > 0) {
        messages = await Message.find({ channelId: channels[0]._id })
          .sort('createdAt')
          .populate('userId', 'avatarUrl');
      }
    } else {
      pendingInvitations = await Invitation.find({ userId: req.body.userId });
    }

    return res.status(200).json({
      teams,
      channels,
      pendingAcceptances,
      pendingInvitations,
      currentUsers,
      messages,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/get-team-members', async (req, res, next) => {
  try {
    const team = await Team.findById(req.body.teamId);
    const currentUsers = await User.find(
      { _id: { $in: team.memberIds } },
      '_id displayName email avatarUrl'
    );
    res.status(200).json({ currentUsers });
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
      inviterEmail: req.body.inviterEmail,
      teamName: req.body.teamName,
    });

    await invitation.save();
    return res.status(200).json({ invitation });
  } catch (err) {
    next(err);
  }
});

router.post('/accept-invitation', async (req, res, next) => {
  try {
    if (req.userId !== req.body.userId)
      return res
        .status(400)
        .json({ err: 'You are not the owner of this invitation.' });
    const team = await Team.findById(req.body.teamId);
    if (!team) {
      await Invitation.deleteOne({ _id: req.body.invitationId });
      return res
        .status(400)
        .json({ err: 'Sorry, this team no longer exists.' });
    }
    team.memberIds.push(req.body.userId);
    await team.save();
    await Invitation.deleteOne({ _id: req.body.invitationId });
    return res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.post('/reject-invitation', async (req, res, next) => {
  try {
    if (req.userId !== req.body.userId)
      return res
        .status(400)
        .json({ err: 'You are not the owner of this invitation.' });
    await Invitation.deleteOne({ _id: req.body.invitationId });
    return res.status(200).json({});
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
    const team = await Team.findById(req.body.teamId);

    if (!team.teamLeaderId.equals(req.userId))
      return res.status(400).json({
        err: 'You are not the owner of the team this channel belongs to.',
      });
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
    let messages = [];
    const channels = await Channel.getList({ teamId: req.body.teamId });
    if (channels.length > 0) {
      messages = await Message.find({ channelId: channels[0]._id });
    }
    res.status(200).json({ channels, messages });
  } catch (err) {
    next(err);
  }
});

router.post('/delete-team', async (req, res, next) => {
  try {
    const team = await Team.findById(req.body.teamId);
    if (!team.teamLeaderId.equals(req.userId))
      return res
        .status(400)
        .json({ err: 'You are not the owner of this team.' });

    const result = await Promise.all([
      team.remove(),
      Channel.find({ teamId: req.body.teamId }).lean(),
    ]);
    const arrayOfChannelIds = [];

    for (let channel of result[1]) {
      arrayOfChannelIds.push(channel._id);
    }

    // deleting all referenced messages and channels
    await Message.deleteMany({ channelId: { $in: arrayOfChannelIds } });
    await Channel.deleteMany({ teamId: req.body.teamId });
    await Invitation.deleteMany({ teamId: req.body.teamId });
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.post('/delete-channel', async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.body.channelId);
    const team = await Team.findById(channel.teamId);
    if (!team.teamLeaderId.equals(req.userId))
      return res.status(400).json({
        err: 'You are not the owner of the team this channel belongs to.',
      });
    await channel.remove();
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.post(
  '/aws/get-signed-request-for-upload-to-s3',
  async (req, res, next) => {
    try {
      console.log(req.body);
      const { fileType, prefix } = req.body;

      const returnData = await signRequestForUpload({
        fileType,
        prefix,
      });
      console.log(returnData);
      res.status(200).json(returnData);
    } catch (err) {
      next(err);
    }
  }
);

router.post('/get-messages', async (req, res, next) => {
  try {
    const messages = await Message.find({ channelId: req.body.channelId }).sort(
      'createdAt'
    );
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
});

router.post('/get-direct-messages', async (req, res, next) => {
  try {
    const directMessages = await DirectMessage.find({
      $or: [
        {
          userId: req.body.userId,
          receiverId: req.body.receiverId,
          teamId: req.body.teamId,
        },
        {
          userId: req.body.receiverId,
          receiverId: req.body.userId,
          teamId: req.body.teamId,
        },
      ],
    });
    res.status(200).json({ messages: directMessages });
  } catch (err) {
    next(err);
  }
});

router.post('/add-message', async (req, res, next) => {
  try {
    const {
      userId,
      userEmail,
      userDisplayName,
      channelId,
      userAvatarUrl,
      text,
    } = req.body;
    const message = new Message({
      userAvatarUrl,
      userId,
      userEmail,
      userDisplayName,
      channelId,
      text,
    });
    await message.save();
    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
});

router.post('/add-direct-message', async (req, res, next) => {
  try {
    const {
      userId,
      userEmail,
      userDisplayName,
      channelId,
      userAvatarUrl,
      text,
      teamId,
      receiverId,
    } = req.body;
    const directMessage = new DirectMessage({
      userId,
      userEmail,
      userDisplayName,
      channelId,
      userAvatarUrl,
      text,
      teamId,
      receiverId,
    });
    await directMessage.save();
    res.status(200).json({ message: directMessage });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
