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
    content: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
      required: true,
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
