const mongoose = require('mongoose');
const slugify = require('slugify');

const mongoSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: String,
  avatarUrl: String,
});

mongoSchema.statics.getUserBySlug = async function ({ slug }) {
  // this refers to the User model
  // lean quickens the query - returning just a plain JS obj
  return this.findOne({ slug }, 'email displayName', {
    lean: true,
  });
};

mongoSchema.statics.updateProfile = async function ({ userId, name }) {
  const user = await this.findById(userId);

  if (name !== user.displayName) {
    user.displayName = name;
  }

  await user.save();

  return user;
};

const User = mongoose.model('User', mongoSchema);

module.exports = User;
