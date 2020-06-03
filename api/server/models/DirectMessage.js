const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    userDisplayName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userAvatarUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Channel',
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const DirectMessage = mongoose.model('DirectMessage', mongoSchema);

module.exports = DirectMessage;
