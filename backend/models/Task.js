const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  // For "Color-coded urgency levels" in UI
  urgency: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);