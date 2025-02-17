const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contacts: [
    { type: Schema.Types.ObjectId, ref: 'User', default: [], required: true }
  ],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [], required: true }],
  isOnline: {
    type: Boolean,
    required: true,
    default : false
  },
  lastSeen:{
    required: true,
    type: Date,
    default: Date.now
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true, // Indexing for faster lookups in production
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook for hashing passwords before saving them
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // Adjust the salt rounds based on production needs
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if passwords match during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre("save", function (next) {
  if (!this.avatar) {
    const encodedName = encodeURIComponent(this.username);
    this.avatar = `https://ui-avatars.com/api/?name=${encodedName}&background=random`;
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;