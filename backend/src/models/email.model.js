const mongoose = require('mongoose');

const emailSchema = mongoose.Schema ( {
  to: {
    type: String,
    required: true,
  },
  cc: {
    type: [String],
  },
  bcc: {
    type: [String],
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  attachments: {
    type: String,
  },
});

module.exports = mongoose.model('Email', emailSchema);