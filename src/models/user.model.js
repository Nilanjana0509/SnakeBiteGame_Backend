const { mongoose, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    ph_no: {
      type: String,
      require: true,
      trim: true,
    },
    address: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
      trim: true,
    },
    devices: {
      type: [
        {
          _id: false,
          deviceId: String,
          lastLogin: Number,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash the password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return; // Use 'this' correctly
  this.password = await bcrypt.hash(this.password, 10); // Await the hash operation
});

// Instance method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
const user = mongoose.model('User', userSchema);
module.exports = user;
