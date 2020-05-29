const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  teamLeaderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  memberIds: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
});

mongoSchema.statics.getList = async function ({ userId }) {
  // return all teams whose members include this userId
  return this.find({ memberIds: userId });
};

const Team = mongoose.model('Team', mongoSchema);

module.exports = Team;
