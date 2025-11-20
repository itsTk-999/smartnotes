const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  colorCode: { type: String, default: '#4A90E2' }, // Hex code for Bento tile background
  icon: { type: String, default: 'book' } // String identifier for frontend icon library
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);