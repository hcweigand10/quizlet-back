const mongoose = require('mongoose');
const { Schema, model } = mongoose
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  // _id: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  //   default: new mongoose.Types.ObjectId
  // },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
    default: "crab"
  }
},
{
  toJSON: {
    virtuals: true
  },
})

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});


const User = model('User', userSchema);

module.exports = User