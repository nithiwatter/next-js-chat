const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Content',
    },
    color: {
      type: String,
      required: false,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const Note = mongoose.model('Note', mongoSchema);

module.exports = Note;
