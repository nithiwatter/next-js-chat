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
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Channel',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', mongoSchema);

module.exports = Message;
