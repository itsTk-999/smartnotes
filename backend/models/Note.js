const mongoose = require('mongoose');

const objectiveSchema = mongoose.Schema({
  text: { type: String, required: true },
  isMastered: { type: Boolean, default: false }
});

const noteSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, default: '' }, // The main note body
  subject: { type: String, default: 'General' },
  // This is the new part that powers your Flashcards
  objectives: [objectiveSchema], 
  tags: [String],
  isFavorite: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);