const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Emotional Layer: Track streaks to reward users
  studyStreak: { type: Number, default: 0 }, 
  // Preference for theme (cool tones vs retro)
  preferences: {
    theme: { type: String, default: 'calm-cool' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Password encryption middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);