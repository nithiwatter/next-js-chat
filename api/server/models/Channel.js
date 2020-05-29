const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

mongoSchema.statics.getList = async function ({ teamId }) {
  // return all teams whose members include this userId
  return this.find({ teamId });
};

const Channel = mongoose.model('Channel', mongoSchema);

module.exports = Channel;
