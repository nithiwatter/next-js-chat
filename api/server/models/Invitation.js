const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  inviterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  inviterEmail: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Invitation = mongoose.model('Invitation', mongoSchema);
module.exports = Invitation;
