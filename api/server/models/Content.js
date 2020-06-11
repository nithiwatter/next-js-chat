const mongoose = require('mongoose');

const mongoSchema = new mongoose.Schema({
  checkbox: {
    type: Boolean,
    required: true,
  },
  textContent: {
    type: String,
  },
  listContent: {
    type: [{}],
  },
});

const Content = mongoose.model('Content', mongoSchema);

module.exports = Content;
