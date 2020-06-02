const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

mongoSchema.statics.getList = async function ({ teamId }) {
  // return all teams whose members include this userId
  return this.find({ teamId }).sort('name').populate('messages');
};

mongoSchema.pre('remove', async function (next) {
  console.log('hooks fired');
  await this.model('Message').deleteMany({ channelId: this._id });
  next();
});

mongoSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'channelId',
  justOne: true,
  options: { sort: { createdAt: -1 } },
});

const Channel = mongoose.model('Channel', mongoSchema);

module.exports = Channel;
