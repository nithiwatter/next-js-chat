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
  return this.find({ teamId }).sort('name');
};

mongoSchema.pre('remove', async function (next) {
  console.log('hooks fired');
  await this.model('Message').deleteMany({ channelId: this._id });
  next();
});

const Channel = mongoose.model('Channel', mongoSchema);

module.exports = Channel;
